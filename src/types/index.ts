export type Language = 'en' | 'bn';
export type Theme = 'light' | 'dark';

export type CategoryId =
  | 'convert'
  | 'image'
  | 'pdf'
  | 'document'
  | 'compress'
  | 'ocr'
  | 'edit'
  | 'create'
  | 'data'
  | 'security';

export interface CategoryInfo {
  id: CategoryId;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  iconName: string;
  badge?: string;
  toolCount: number;
}

export interface ToolInfo {
  id: string;
  slug: string;
  categoryId: CategoryId;
  name: { en: string; bn: string };
  description: { en: string; bn: string };
  iconName: string;
  badge?: 'Popular' | 'New' | 'Fast' | 'Essential';
  tags: string[];
  acceptedExtensions?: string[];
  acceptedMimeTypes?: string[];
  maxFiles?: number;
}

export type ProcessingState = 'idle' | 'processing' | 'success' | 'error';
