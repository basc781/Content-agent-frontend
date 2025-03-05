interface ValidationResponse {
  formDataValidation: {
    valid: boolean;
    feedback: string[];
  }
}

export interface Article {
  id: number;
  userId: string;
  text: string;
  contentCalendarId: number;
  status: string;
  pagepath?: string;
  createdAt: string;
  outputFormat: string;
  title?: string; // Voeg title toe als optioneel veld
}

export interface ContentCalendarItem {
  id: number;
  userId: string;
  title: string;
  dateCreated: string;
  formData: {
    datum: string;
    event: string;
    titel: string;
    beschrijving: string;
    potentialKeywords: string;
    winkelvoorbeelden: string;
  };
  status: string;
  articles: Article[];
}

interface ArticlesResponse {
  publishedContentCalendarItems: ContentCalendarItem[];
}

export const generateArticle = async (formData: any, userId: string) => {
  try {
    // Extract website and imageUrls from formData
    const {titel, website, imageUrls, ...otherFormData } = formData;
    
    // Create a copy of otherFormData that includes titel
    const combinedFormData = {
      ...otherFormData,
      titel: titel
    };
    
    console.log("Sending data to API:", { formData: combinedFormData, website, imageUrls, userId });
    
    const response = await fetch(`${import.meta.env.GENERATE_ARTICLE_API_URL}`, {
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
  } catch (error) {
    console.error("Generate article error:", error);
    throw error;
  }
};

export const validateFormData = async (formData: any, userId: string): Promise<ValidationResponse> => {
  console.log("User ID being sent:", userId);
  const response = await fetch(`${import.meta.env.VALIDATE_FORM_DATA_API_URL}`, {
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

export const fetchArticles = async (userId: string): Promise<ArticlesResponse> => {
  try {
    const response = await fetch(`${import.meta.env.FETCH_ARTICLES_API_URL}?userId=${userId}`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    const data: ArticlesResponse = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
