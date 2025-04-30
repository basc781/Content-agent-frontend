import { useEffect, useState, useCallback } from "react";
import { useOrganization } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Body from "../components/Body";
import { uploadImages, getOrganizationModules, imagePayload } from "../services/api";
import "./Settings.css";
import { ModuleHeader } from "../types/module";

function Settings() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<ModuleHeader[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  // Check if user is admin in current organization
  const isAdmin = user && organization && user.organizationMemberships?.some(
    membership => membership.organization.id === organization.id && membership.role === "org:admin"
  );

  // Redirect non-admin users
  useEffect(() => {
    if (user && organization && !isAdmin) {
      navigate("/");
    }
  }, [user, organization, isAdmin, navigate]);

  // Fetch available modules
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const moduleHeaders = await getOrganizationModules();
        console.log("Module headers:", moduleHeaders);
        setModules(moduleHeaders);
        
        // Set the first module's id as default if available
        if (moduleHeaders.length > 0 && moduleHeaders[0].id) {
          setSelectedModuleId(moduleHeaders[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch modules:", err);
        setError("Failed to load modules. Please try again later.");
      }
    };

    if (organization) {
      fetchModules();
    }
  }, [organization]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    setUploadSuccess(false);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5242880, // 5MB
  });

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      setError("Please select files to upload");
      return;
    }

    if (selectedModuleId === null) {
      setError("Please select a module");
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      const imageRequest: imagePayload = {
        images: uploadedFiles.map(file => ({
          file: file,
          filename: file.name,
          uniqueFilename: `${Date.now()}-${file.name.replace(/\s+/g, '-')}`,
          contentType: file.type
        }))
      };
      
      await uploadImages(imageRequest, modules[0].accessId || "");
      setUploadSuccess(true);
      setUploadedFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    
    if (newFiles.length === 0) {
      // Reset states if all files are deleted
      setUploadSuccess(false);
    }
  };

  const handleDeleteAllFiles = () => {
    setUploadedFiles([]);
    setUploadSuccess(false);
  };

  // Delete icon component
  const DeleteIcon = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M3 6H5H21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  if (!user || !organization) {
    return (
      <Body>
        <div className="settings-loading">Loading...</div>
      </Body>
    );
  }

  return (
    <Body>
      <div className="settings-container">
        <div className="settings-section">
          <h2>Image Upload</h2>
          <p>Upload images to use in your content</p>
          
          <div className="settings-card">
            <div className="module-selector">
              <label htmlFor="module-select">Select Module:</label>
              <select 
                id="module-select" 
                value={selectedModuleId || ''} 
                onChange={(e) => setSelectedModuleId(Number(e.target.value))}
                className="module-select"
              >
                <option value="" disabled>Select a module</option>
                {modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div 
              {...getRootProps()} 
              className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here...</p>
              ) : (
                <p>Drag & drop images here, or click to select files</p>
              )}
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="file-list">
                <div className="file-list-header">
                  <h3>Selected Files ({uploadedFiles.length})</h3>
                  <button 
                    className="delete-all-button" 
                    onClick={handleDeleteAllFiles}
                    aria-label="Delete all files"
                  >
                    Delete All
                  </button>
                </div>
                <div className="file-list-container">
                  <ul>
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="file-item">
                        <div className="file-info">
                          {file.name} - {(file.size / 1024).toFixed(2)} KB
                        </div>
                        <button 
                          className="delete-button" 
                          onClick={() => handleDeleteFile(index)}
                          aria-label={`Delete ${file.name}`}
                        >
                          <DeleteIcon />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {error && <div className="upload-error">{error}</div>}
            {uploadSuccess && (
              <div className="upload-success">
                <p>Images uploaded successfully! It takes up to a few hours for them to be available for use in your content.</p>
              </div>
            )}
            
            <button 
              className="upload-button" 
              onClick={handleUpload}
              disabled={uploading || uploadedFiles.length === 0 || selectedModuleId === null}
            >
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        </div>
      </div>
    </Body>
  );
}

export default Settings; 