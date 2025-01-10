// types.ts

// Common types for base entities
interface BaseEntity {
  id: string;
  backgroundColor: string;
  title: string;
}

// Slide-related types
export interface BaseSlide extends BaseEntity {
  subtitle: string;
  cta: string;
}

export interface RegularSlide extends BaseSlide {
  type: "regular";
  image: string;
}

export interface EditorSlide extends BaseSlide {
  type: "editor";
}

export type Slide = RegularSlide | EditorSlide;

export interface NewSlideState {
  backgroundColor: string;
  title: string;
  subtitle: string;
  cta: string;
}

export interface SlideResponse {
  success: boolean;
  slides?: Slide[];
  error?: string;
}

// Collection-related types
export interface BaseCollection extends BaseEntity {
  type: string;
  image: string;
  href: string;
  position: number;
}

export interface CollectionResponse {
  success: boolean;
  collections?: BaseCollection[];
  error?: string;
}

// State management types
interface BaseState {
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface CollectionState extends BaseState {
  collections: BaseCollection[];
}

interface BaseActions {
  reset: () => void;
  setInitialized: (initialized: boolean) => void;
}

export interface CollectionActions extends BaseActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  update: (id: string, formData: FormData) => Promise<void>;
  fetchCollections: () => Promise<void>;
}

// Store types
export type CollectionStore = CollectionState & CollectionActions;

// Form Data types
export interface CollectionFormData {
  title: string;
  href: string;
  type: string;
  position: number;
  backgroundColor: string;
  image?: File;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Utility types
export type CollectionType = "tshirt" | "apparel" | "kids" | "headwear";

export const COLLECTION_POSITIONS = {
  TSHIRT: 1,
  APPAREL: 2,
  KIDS: 3,
  HEADWEAR: 4,
} as const;

export type CollectionPosition =
  (typeof COLLECTION_POSITIONS)[keyof typeof COLLECTION_POSITIONS];
