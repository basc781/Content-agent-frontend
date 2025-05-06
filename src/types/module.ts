export interface ModuleHeader {
  id: number;
  name: string;
  slug: string;
  accessId?: string;
}

export type Module = {
  id: number;
  name: string;
  slug: string;
  title: string;
  description: string;
  webScraper: boolean;
  images: boolean;
  productAPI: boolean;
  updatedAt: Date;
  createdAt: Date;
  orgModuleAccess: any;
  outputFormat: 'emailHTML' | 'json' | 'markdown';
};
