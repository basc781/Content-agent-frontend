import { Module, ModuleHeader } from "../types/module";

declare global {
  interface Window {
    Clerk: {
      session: {
        getToken(): Promise<string>;
      };
    };
  }
}

interface ValidationResponse {
  formDataValidation: {
    valid: boolean;
    feedback: string[];
  };
}

export interface Article {
  id: number;
  orgId: string;
  text: string;
  contentCalendarId: number;
  status: string;
  pagepath?: string;
  createdAt: string;
  outputFormat: string;
  title?: string; // Voeg title toe als optioneel veld
}

export interface RenderArticle {
  title: string;
  text: string;
  createdAt: string;
  outputFormat: "json" | "markdown";
}

export interface ContentCalendarItem {
  id: number;
  orgId: string;
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

const baseURL = import.meta.env.VITE_API_URL;

const GetAuthToken = async () => {
  if (typeof window.Clerk === "undefined") {
    console.error("Clerk is not available");
    return;
  }

  const token = await window.Clerk.session.getToken();

  return token;
};

export const generateArticle = async (formData: any, moduleId: number) => {
  try {
    // Extract website and imageUrls from formData
    const { titel, website, imageUrls, ...otherFormData } = formData;

    // Create a copy of otherFormData that includes titel
    const combinedFormData = {
      ...otherFormData,
      titel: titel,
    };

    console.log("Sending data to API:", {
      formData: combinedFormData,
      website,
      imageUrls,
    });

    const token = await GetAuthToken();

    const response = await fetch(`${baseURL}/content/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        formData: combinedFormData,
        website,
        imageUrls,
        moduleId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("API error response:", errorData);
      throw new Error("Failed to generate article");
    }

    return await response.json();
  } catch (error) {
    console.error("Generate article error:", error);
    throw error;
  }
};

export const validateFormData = async (
  formData: any
): Promise<ValidationResponse> => {
  const token = await GetAuthToken();

  const response = await fetch(`${baseURL}/content/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ formData }),
  });

  if (!response.ok) {
    throw new Error("Failed to validate form data");
  }

  return await response.json();
};

export const fetchArticles = async (
  moduleId: string
): Promise<ArticlesResponse> => {
  const token = await GetAuthToken();

  const response = await fetch(
    `${baseURL}/content/calendar?moduleId=${moduleId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch articles");
  const data: ArticlesResponse = await response.json();
  return data;
};

export const fetchArticle = async (
  pagepath: string
): Promise<RenderArticle> => {
  const token = await GetAuthToken();

  const response = await fetch(`${baseURL}/content/${pagepath}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch articles");
  const data: RenderArticle = await response.json();

  return data;
};

export const getOrganizationModules = async (): Promise<ModuleHeader[]> => {
  const token = await GetAuthToken();

  const response = await fetch(`${baseURL}/modules`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch articles");
  const data: { modules: Module[] } = await response.json();
  return data.modules;
};

export const getModule = async (slug: string): Promise<Module> => {
  const token = await GetAuthToken();

  const response = await fetch(`${baseURL}/modules/${slug}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch articles");
  const data: { module: Module } = await response.json();

  console.log("Module:", data.module);
  return data.module;
};

export const deleteArticle = async (id: number) => {
  const token = await GetAuthToken();

  const response = await fetch(`${baseURL}/content/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete article");
  return await response.json();
};
