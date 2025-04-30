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

export interface imagePayload {
  images: {
    file: File;
    filename: string;
    uniqueFilename: string;
    contentType: string;
  }[];
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

export interface imagesWithAuthenticatedUrls {
  contentType: string;
  filename: string;
  uniqueFilename: string;
  authenticatedUrl: string;
}

interface authenticatedUrls {
  images: imagesWithAuthenticatedUrls[];
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
  console.log("WORD DEZE GETRIGGERED NU");
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

export const uploadImages = async (images: imagePayload, accessId: string): Promise<string> => {
  
  let allUploadedImages: imagesWithAuthenticatedUrls[] = [];

  console.log("Uploading images:", images);

  const token = await GetAuthToken();
  // Get upload URLs for all images
  const response = await fetch(`${baseURL}/images/get-upload-urls`, {
    method: "POST", 
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      images: images.images.map(img => ({
        filename: img.filename,
        uniqueFilename: img.uniqueFilename,
        contentType: img.file.type
      })),
      accessId
    })
  });
  if (!response.ok) throw new Error("Failed to get upload URLs");

  const data: authenticatedUrls = await response.json();

  // Upload all images to their authenticated URLs
  for (const image of data.images) {
    const originalImage = images.images.find(img => img.filename === image.filename);
    
    if (!originalImage) {
      throw new Error(`Could not find original image data for ${image.filename}`);
    }

    const uploadResponse = await fetch(image.authenticatedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": image.contentType
      },
      body: originalImage.file,
    });

    if (!uploadResponse.ok) throw new Error(`Failed to upload image ${image.filename}`);
  }

  allUploadedImages = [...allUploadedImages, ...data.images];

  // Trigger metadata generation but don't wait for result
  fetch(`${baseURL}/images/generate-metadata`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ images: data.images, accessId }),
  });

  // Return empty metadata array since generation will happen asynchronously
  console.log("All images uploaded successfully");
  return "All images uploaded successfully";
};
