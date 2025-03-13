// import './ArticleGenerator.css';
// import { useState, useEffect } from 'react';
// import { generateArticle, validateFormData } from '../services/api';
// import FeedbackModal from './FeedbackModal';
// import { FiLoader } from 'react-icons/fi';
// import { useUser } from '@clerk/clerk-react';

// interface ValidationResponse {
//   formDataValidation: {
//     valid: boolean;
//     feedback: string[];
//   }
// }

// function ArticleGenerator() {
//   const {user} = useUser()
//   if (!user) {
//     return <div>Please sign in to continue</div>
//   }

//   const [formData, setFormData] = useState({
//     titel: '',
//     event: '',
//     beschrijving: '',
//     potentialKeywords: '',
//     datum: '',
//     winkelvoorbeelden: '',
//     website: 'https://www.acties.nl/sitemap.xml',
//     imageUrls: ''
//   });

//   const [isFormValid, setIsFormValid] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);

//   useEffect(() => {
//     const isValid = Object.values(formData).every(value => value.trim() !== '');
//     setIsFormValid(isValid);
//   }, [formData]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isFormValid) return;

//     try {
//       setIsLoading(true);
//       setError(null);
//       const response = await validateFormData(formData as any, user.id as string);
//       setValidationResult(response);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGenerateArticle = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       if (!user) {
//         throw new Error('User not found');
//       }
//       console.log("User ID being sent:", user.id);
//       // Fire and forget - don't await the response
//       generateArticle(formData as any, user.id as string);

//       // Immediately close modal and reset state
//       setValidationResult(null);
//       setIsLoading(false);

//       // Optional: Show some feedback that the generation started
//       // toast.success('Article generation started');

//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An error occurred');
//       setIsLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setValidationResult(null);
//   };

//   return (
//     <div className="article-generator">
//       <div className="component-header">
//         <h2>Generate New Content</h2>
//         <p>Create AI-powered articles by filling out the form below</p>
//       </div>

//       {error && <div className="error-message">{error}</div>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="titel">Title</label>
//             <input
//               type="text"
//               id="titel"
//               value={formData.titel}
//               onChange={handleChange}
//               placeholder="Enter article title"
//               disabled={isLoading}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="event">Event</label>
//             <input
//               type="text"
//               id="event"
//               value={formData.event}
//               onChange={handleChange}
//               placeholder="Enter event name"
//               disabled={isLoading}
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label htmlFor="beschrijving">Description</label>
//           <textarea
//             id="beschrijving"
//             value={formData.beschrijving}
//             onChange={handleChange}
//             placeholder="Enter description"
//             rows={4}
//             disabled={isLoading}
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="potentialKeywords">Keywords</label>
//             <input
//               type="text"
//               id="potentialKeywords"
//               value={formData.potentialKeywords}
//               onChange={handleChange}
//               placeholder="Enter keywords (comma separated)"
//               disabled={isLoading}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="datum">Date</label>
//             <input
//               type="date"
//               id="datum"
//               value={formData.datum}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label htmlFor="winkelvoorbeelden">Store Examples</label>
//           <textarea
//             id="winkelvoorbeelden"
//             value={formData.winkelvoorbeelden}
//             onChange={handleChange}
//             placeholder="Enter store examples"
//             rows={3}
//             disabled={isLoading}
//           />
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="website">Website</label>
//             <input
//               type="text"
//               id="website"
//               value={formData.website}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="imageUrls">Image URLs</label>
//             <input
//               type="text"
//               id="imageUrls"
//               value={formData.imageUrls}
//               onChange={handleChange}
//               placeholder="Enter image URLs (comma separated)"
//               disabled={isLoading}
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={!isFormValid || isLoading}
//           className={`generate-article-button ${isLoading ? 'loading' : ''}`}
//         >
//           {isLoading ? (
//             <>
//               <FiLoader className="spinner" />
//               Aan het valideren, dit kan even duren...
//             </>
//           ) : (
//             'Generate Article'
//           )}
//         </button>
//       </form>

//       {validationResult && (
//         <FeedbackModal
//           isValid={validationResult.formDataValidation.valid}
//           feedback={validationResult.formDataValidation.feedback}
//           onClose={closeModal}
//           onGenerate={handleGenerateArticle}
//         />
//       )}
//     </div>
//   );
// }

// export default ArticleGenerator;
