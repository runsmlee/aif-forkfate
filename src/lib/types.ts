export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  condition: ToolCondition;
  imageUrl: string;
  owner: Owner;
  available: boolean;
  location: string;
  borrowedBy: string | null;
  createdAt: string;
}

export type ToolCategory =
  | 'power-tools'
  | 'hand-tools'
  | 'garden'
  | 'workshop'
  | 'measuring'
  | 'safety';

export type ToolCondition = 'excellent' | 'good' | 'fair' | 'worn';

export interface Owner {
  id: string;
  name: string;
  avatarInitials: string;
  distance: string;
  rating: number;
  toolCount: number;
}

export interface BorrowRequest {
  toolId: string;
  borrowerName: string;
  message: string;
  requestedDate: string;
}

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  'power-tools': 'Power Tools',
  'hand-tools': 'Hand Tools',
  garden: 'Garden',
  workshop: 'Workshop',
  measuring: 'Measuring',
  safety: 'Safety',
};

export const CONDITION_LABELS: Record<ToolCondition, string> = {
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  worn: 'Well-used',
};
