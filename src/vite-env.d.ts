
interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_API_URL: string
  readonly VITE_GENERATE_ARTICLE_API_URL: string
  readonly VITE_VALIDATE_FORM_DATA_API_URL: string
  readonly VITE_FETCH_ARTICLES_API_URL: string
  readonly VITE_R2_PUBLIC_URL: string
  // Add any other environment variables you use
}

  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }