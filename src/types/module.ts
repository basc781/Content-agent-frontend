export type ModuleHeader = {
  name: string;
  slug: string;
};

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
};
