export const generateArticle = async (formData, userId) => {
    try {
        // Extract website and imageUrls from formData
        const { titel, website, imageUrls, ...otherFormData } = formData;
        // Create a copy of otherFormData that includes titel
        const combinedFormData = {
            ...otherFormData,
            titel: titel
        };
        console.log("Sending data to API:", { formData: combinedFormData, website, imageUrls, userId });
        const response = await fetch('http://localhost:3000/api/generate-article', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                formData: combinedFormData,
                titel,
                website,
                imageUrls,
                userId
            })
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("API error response:", errorData);
            throw new Error('Failed to generate article');
        }
        return await response.json();
    }
    catch (error) {
        console.error("Generate article error:", error);
        throw error;
    }
};
export const validateFormData = async (formData, userId) => {
    console.log("User ID being sent:", userId);
    const response = await fetch('http://localhost:3000/api/check-form-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, userId })
    });
    if (!response.ok) {
        throw new Error('Failed to validate form data');
    }
    return await response.json();
};
export const fetchArticles = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3000/api/get-published-content-calendar-items?userId=${userId}`);
        if (!response.ok)
            throw new Error('Failed to fetch articles');
        const data = await response.json();
        return data;
    }
    catch (error) {
        throw error;
    }
};
