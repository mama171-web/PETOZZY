export type Language = 'ca' | 'pt' | 'es';

export type PageId =
  | 'inici'
  | 'cataleg'
  | 'personalitzador'
  | 'seguiment'
  | 'sheet-tracking'
  | 'blog'
  | 'qui-som'
  | 'contacte'
  | 'checkout'
  | 'legal';

export type LivingRoomSceneId = 'oak' | 'scandi' | 'walnut' | 'marble';

export interface PastelColor {
  id: string;
  name: {
    ca: string;
    pt: string;
    es: string;
  };
  hex: string;
}

export interface PetMugProduct {
  id: string;
  petName: string;
  petType: 'gos' | 'gat';
  breed: {
    ca: string;
    pt: string;
    es: string;
  };
  title: {
    ca: string;
    pt: string;
    es: string;
  };
  subtitle: {
    ca: string;
    pt: string;
    es: string;
  };
  price: number;
  image: string;
  portraitImage?: string;
  defaultScene?: LivingRoomSceneId;
  defaultColorId: string;
  tag: {
    ca: string;
    pt: string;
    es: string;
  };
}

export interface CartItem {
  cartId: string;
  productId: string;
  title: string;
  price: number;
  interiorColor: PastelColor;
  petName: string;
  photoUrl?: string;
  quantity: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  petName: string;
  selectedColorId: string;
  message: string;
}

export type OrderStage =
  | 'received'
  | 'preview_pending'
  | 'production'
  | 'shipped'
  | 'delivered';

export interface TrackedOrder {
  code: string;
  customerName: string;
  petName: string;
  mugTitle: string;
  interiorColor: PastelColor;
  photoUrl: string;
  stage: OrderStage;
  destination: string;
  paymentMethod: string;
  orderDate: string;
  estimatedDelivery: string;
  previewApproved: boolean;
  total: number;
}

export interface LegalBlogArticle {
  id: string;
  categoryKey: 'ceramica' | 'bienestar';
  categoryLabel: {
    ca: string;
    pt: string;
    es: string;
  };
  date: string;
  readTime: string;
  title: {
    ca: string;
    pt: string;
    es: string;
  };
  summary: {
    ca: string;
    pt: string;
    es: string;
  };
  keyPoints: {
    ca: string[];
    pt: string[];
    es: string[];
  };
  content: {
    ca: string[];
    pt: string[];
    es: string[];
  };
}

export interface FaqItem {
  id: string;
  question: {
    ca: string;
    pt: string;
    es: string;
  };
  answer: {
    ca: string;
    pt: string;
    es: string;
  };
}

export interface TestimonialItem {
  id: string;
  customerName: string;
  petName: string;
  city: string;
  rating: number;
  image: string;
  quote: {
    ca: string;
    pt: string;
    es: string;
  };
  outcome: {
    ca: string;
    pt: string;
    es: string;
  };
}
