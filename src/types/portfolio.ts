export type SectionTheme = 'cream' | 'coral' | 'lilac' | 'yellow' | 'sage' | 'pink';

export interface MediaAsset {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  updatedAt: string;
}

export type ProjectCategory =
  | 'Contenus & Réseaux'
  | 'Stratégie & KPI'
  | 'Communication & Événements'
  | 'Créations visuelles';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  context: string;
  role: string;
  challenge: string;
  idea: string;
  deliverables: string[];
  accentColor: 'coral' | 'lilac' | 'yellow' | 'sage' | 'pink' | 'sky';
  visuals: MediaAsset[];
  featured?: boolean;
}

export interface MoodboardItem {
  id: string;
  type: 'image' | 'quote' | 'palette' | 'note';
  title: string;
  caption: string;
  imageUrl?: string;
  imageAlt?: string;
  colors?: string[];
  bgTone: 'coral' | 'lilac' | 'yellow' | 'sage' | 'pink' | 'cream' | 'sky';
  x: number;
  y: number;
  rotate: number;
  zIndex: number;
}

export interface PortfolioData {
  portrait: MediaAsset | null;
  artisticPhoto: MediaAsset | null;
  projects: ProjectItem[];
  moodboard: MoodboardItem[];
  hasCustomCv: boolean;
  publishedAt: string | null;
}

export interface StudioState {
  published: PortfolioData;
  draft: PortfolioData;
  hasUnpublishedChanges: boolean;
}
