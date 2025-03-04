import './ArticleGenerator.css';
import { useState, useEffect } from 'react';
import { generateArticle, validateFormData } from '../services/api';
import FeedbackModal from './FeedbackModal';
import { FiLoader } from 'react-icons/fi';
import { useUser } from '@clerk/clerk-react';

interface ValidationResponse {
  formDataValidation: {
    valid: boolean;
    feedback: string[];
  }
}

function IdArticleGenerator() {
  const {user} = useUser();
  if (!user) {
    return <div>Please sign in to continue</div>
  }

  const [formData, setFormData] = useState({
    prompt: '',
    productDatabase: true,
    imageUrls: '',
    title: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);

  useEffect(() => {
    // Check if prompt, imageUrls, and title are filled in
    const isValid = formData.prompt.trim() !== '' && 
                   formData.imageUrls.trim() !== '' &&
                   formData.title.trim() !== '';
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const toggleProductDatabase = () => {
    setFormData(prev => ({
      ...prev,
      productDatabase: !prev.productDatabase
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Gebruik de validateFormData functie uit de API
      const formDataToValidate = {
        ...formData
      };
      
      const response = await validateFormData(formDataToValidate, user.id);
      setValidationResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateArticle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('User not found');
      }

      const requestData = {
        formData: {
          ...formData,
          titel: formData.title  // Include title as 'titel' in formData
        },
        titel: formData.title,   // Also include title separately as 'titel'
        imageUrls: formData.imageUrls,
        userId: user.id
      };

      await generateArticle(requestData, user.id);
      
      setValidationResult(null);
      setIsLoading(false);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setValidationResult(null);
  };

  return (
    <div className="article-generator">
      <div className="component-header">
        <h2>Generate ID.nl Content</h2>
        <p>Create AI-powered articles for ID.nl by filling out the form below</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter article title..."
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="prompt">Prompt</label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={handleChange}
            placeholder="Beschrijf het artikel dat je wilt genereren..."
            rows={6}
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-group toggle-container">
            <label>Product Database</label>
            <div className="toggle-switch">
              <button 
                type="button"
                className={`toggle-button ${formData.productDatabase ? 'active' : ''}`}
                onClick={toggleProductDatabase}
                disabled={isLoading}
              >
                {formData.productDatabase ? 'Aan' : 'Uit'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrls">Afbeelding URLs</label>
            <input
              type="text"
              id="imageUrls"
              value={formData.imageUrls}
              onChange={handleChange}
              placeholder="Voer afbeelding URLs in (gescheiden door komma's)"
              disabled={isLoading}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={!isFormValid || isLoading}
          className={`generate-article-button ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? (
            <>
              <FiLoader className="spinner" />
              Bezig met verwerken...
            </>
          ) : (
            'Genereer Artikel'
          )}
        </button>
      </form>

      {validationResult && (
        <FeedbackModal
          isValid={validationResult.formDataValidation.valid}
          feedback={validationResult.formDataValidation.feedback}
          onClose={closeModal}
          onGenerate={handleGenerateArticle}
        />
      )}
    </div>
  );
}

export default IdArticleGenerator; 