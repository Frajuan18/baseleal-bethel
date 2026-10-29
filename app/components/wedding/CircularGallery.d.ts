import type { CSSProperties, ComponentType, RefObject } from 'react';

export interface CircularGalleryHandle {
  wake: () => void;
  open: (index: number) => void;
  focus: (index: number) => void;
  prev: () => void;
  next: () => void;
  close: () => void;
}

export interface CircularGalleryItem {
  image: string;
  text?: string;
  alt?: string;
  description?: string;
}

export interface CircularGalleryProps {
  items?: CircularGalleryItem[];
  galleryRef?: RefObject<CircularGalleryHandle | null> | ((handle: CircularGalleryHandle | null) => void);
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  fontUrl?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  itemSize?: number;
  itemAspect?: number;
  gap?: number;
  wave?: number;
  fadeEdges?: number;
  shadow?: number;
  grayscale?: boolean;
  showTitles?: boolean;
  snap?: boolean;
  autoScroll?: number;
  openOnClick?: boolean;
  intro?: boolean;
  onItemClick?: (item: CircularGalleryItem, index: number) => void;
  onActiveChange?: (index: number) => void;
  dpr?: number;
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

declare const CircularGallery: ComponentType<CircularGalleryProps>;
export default CircularGallery;
