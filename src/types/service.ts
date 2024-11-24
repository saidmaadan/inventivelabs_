export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  benefits: string[];
  category: ServiceCategory;
  slug: string;
  order: number;
}

export type ServiceCategory = 
  | "development"
  | "design"
  | "consulting"
  | "maintenance";

export interface ServicesPageParams {
  category?: ServiceCategory;
  searchQuery?: string;
}
