import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './ArticleGenerator.css';
import { useState, useEffect } from 'react';
import { generateArticle, validateFormData } from '../services/api';
import FeedbackModal from './FeedbackModal';
import { FiLoader } from 'react-icons/fi';
import { useUser } from '@clerk/clerk-react';
function ArticleGenerator() {
    const { user } = useUser();
    if (!user) {
        return _jsx("div", { children: "Please sign in to continue" });
    }
    const [formData, setFormData] = useState({
        titel: '',
        event: '',
        beschrijving: '',
        potentialKeywords: '',
        datum: '',
        winkelvoorbeelden: '',
        website: 'https://www.acties.nl/sitemap.xml',
        imageUrls: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    useEffect(() => {
        const isValid = Object.values(formData).every(value => value.trim() !== '');
        setIsFormValid(isValid);
    }, [formData]);
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid)
            return;
        try {
            setIsLoading(true);
            setError(null);
            const response = await validateFormData(formData, user.id);
            setValidationResult(response);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
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
            console.log("User ID being sent:", user.id);
            // Fire and forget - don't await the response
            generateArticle(formData, user.id);
            // Immediately close modal and reset state
            setValidationResult(null);
            setIsLoading(false);
            // Optional: Show some feedback that the generation started
            // toast.success('Article generation started');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setIsLoading(false);
        }
    };
    const closeModal = () => {
        setValidationResult(null);
    };
    return (_jsxs("div", { className: "article-generator", children: [_jsxs("div", { className: "component-header", children: [_jsx("h2", { children: "Generate New Content" }), _jsx("p", { children: "Create AI-powered articles by filling out the form below" })] }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "titel", children: "Title" }), _jsx("input", { type: "text", id: "titel", value: formData.titel, onChange: handleChange, placeholder: "Enter article title", disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "event", children: "Event" }), _jsx("input", { type: "text", id: "event", value: formData.event, onChange: handleChange, placeholder: "Enter event name", disabled: isLoading })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "beschrijving", children: "Description" }), _jsx("textarea", { id: "beschrijving", value: formData.beschrijving, onChange: handleChange, placeholder: "Enter description", rows: 4, disabled: isLoading })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "potentialKeywords", children: "Keywords" }), _jsx("input", { type: "text", id: "potentialKeywords", value: formData.potentialKeywords, onChange: handleChange, placeholder: "Enter keywords (comma separated)", disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "datum", children: "Date" }), _jsx("input", { type: "date", id: "datum", value: formData.datum, onChange: handleChange, disabled: isLoading })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "winkelvoorbeelden", children: "Store Examples" }), _jsx("textarea", { id: "winkelvoorbeelden", value: formData.winkelvoorbeelden, onChange: handleChange, placeholder: "Enter store examples", rows: 3, disabled: isLoading })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "website", children: "Website" }), _jsx("input", { type: "text", id: "website", value: formData.website, onChange: handleChange, disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "imageUrls", children: "Image URLs" }), _jsx("input", { type: "text", id: "imageUrls", value: formData.imageUrls, onChange: handleChange, placeholder: "Enter image URLs (comma separated)", disabled: isLoading })] })] }), _jsx("button", { type: "submit", disabled: !isFormValid || isLoading, className: `generate-article-button ${isLoading ? 'loading' : ''}`, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(FiLoader, { className: "spinner" }), "Aan het valideren, dit kan even duren..."] })) : ('Generate Article') })] }), validationResult && (_jsx(FeedbackModal, { isValid: validationResult.formDataValidation.valid, feedback: validationResult.formDataValidation.feedback, onClose: closeModal, onGenerate: handleGenerateArticle }))] }));
}
export default ArticleGenerator;
