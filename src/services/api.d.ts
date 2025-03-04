interface ValidationResponse {
    formDataValidation: {
        valid: boolean;
        feedback: string[];
    };
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
    title?: string;
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
export declare const generateArticle: (formData: any, userId: string) => Promise<any>;
export declare const validateFormData: (formData: any, userId: string) => Promise<ValidationResponse>;
export declare const fetchArticles: (userId: string) => Promise<ArticlesResponse>;
export {};
