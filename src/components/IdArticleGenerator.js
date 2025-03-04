import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './ArticleGenerator.css';
import { useState, useEffect } from 'react';
import { generateArticle, validateFormData } from '../services/api';
import FeedbackModal from './FeedbackModal';
import { FiLoader } from 'react-icons/fi';
import { useUser } from '@clerk/clerk-react';
function IdArticleGenerator() {
    const { user } = useUser();
    if (!user) {
        return _jsx("div", { children: "Please sign in to continue" });
    }
    const [formData, setFormData] = useState({
        prompt: '',
        productDatabase: true,
        imageUrls: '',
        title: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationResult, setValidationResult] = useState(null);
    useEffect(() => {
        // Check if prompt, imageUrls, and title are filled in
        const isValid = formData.prompt.trim() !== '' &&
            formData.imageUrls.trim() !== '' &&
            formData.title.trim() !== '';
        setIsFormValid(isValid);
    }, [formData]);
    const handleChange = (e) => {
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid)
            return;
        try {
            setIsLoading(true);
            setError(null);
            // Gebruik de validateFormData functie uit de API
            const formDataToValidate = {
                ...formData
            };
            const response = await validateFormData(formDataToValidate, user.id);
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
            const requestData = {
                formData: {
                    ...formData,
                    titel: formData.title // Include title as 'titel' in formData
                },
                titel: formData.title, // Also include title separately as 'titel'
                imageUrls: formData.imageUrls,
                userId: user.id
            };
            await generateArticle(requestData, user.id);
            setValidationResult(null);
            setIsLoading(false);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setIsLoading(false);
        }
    };
    const closeModal = () => {
        setValidationResult(null);
    };
    return (_jsxs("div", { className: "article-generator", children: [_jsxs("div", { className: "component-header", children: [_jsx("h2", { children: "Generate ID.nl Content" }), _jsx("p", { children: "Create AI-powered articles for ID.nl by filling out the form below" })] }), error && _jsx("div", { className: "error-message", children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "title", children: "Title" }), _jsx("input", { type: "text", id: "title", value: formData.title, onChange: handleChange, placeholder: "Enter article title...", disabled: isLoading })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "prompt", children: "Prompt" }), _jsx("textarea", { id: "prompt", value: formData.prompt, onChange: handleChange, placeholder: "Beschrijf het artikel dat je wilt genereren...", rows: 6, disabled: isLoading })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group toggle-container", children: [_jsx("label", { children: "Product Database" }), _jsx("div", { className: "toggle-switch", children: _jsx("button", { type: "button", className: `toggle-button ${formData.productDatabase ? 'active' : ''}`, onClick: toggleProductDatabase, disabled: isLoading, children: formData.productDatabase ? 'Aan' : 'Uit' }) })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "imageUrls", children: "Afbeelding URLs" }), _jsx("input", { type: "text", id: "imageUrls", value: formData.imageUrls, onChange: handleChange, placeholder: "Voer afbeelding URLs in (gescheiden door komma's)", disabled: isLoading })] })] }), _jsx("button", { type: "submit", disabled: !isFormValid || isLoading, className: `generate-article-button ${isLoading ? 'loading' : ''}`, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(FiLoader, { className: "spinner" }), "Bezig met verwerken..."] })) : ('Genereer Artikel') })] }), validationResult && (_jsx(FeedbackModal, { isValid: validationResult.formDataValidation.valid, feedback: validationResult.formDataValidation.feedback, onClose: closeModal, onGenerate: handleGenerateArticle }))] }));
}
export default IdArticleGenerator;
