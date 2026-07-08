export type IndianCategoryType = 'Trash' | 'Leaf' | 'Factory' | 'Smoke' | 'Dust' | 'Vehicular';

export interface UserProfile {
  name: string;
  state: string;
  city: string;
  userId: string; // Handle e.g., @amit_delhi
  registered: boolean;
  avatar?: string;
  email?: string;
  uid?: string;
  points?: number;
  reportsCount?: number;
  checkins?: string[];
  photoURL?: string;
}

export interface CitizenReport {
  id: string;
  timestamp: string;
  category: IndianCategoryType;
  description: string;
  aqiModifier: number;
  state: string;
  city: string;
  imageUrl: string;
  citizenName: string;
  userId: string;
  status: 'Pending' | 'Dispatched' | 'Resolved';
  lat?: number;
  lon?: number;
}

export interface CommunityMessage {
  id: string;
  senderName: string;
  senderId: string;
  state: string;
  city: string;
  text: string;
  timestamp: string;
  isUser: boolean;
  avatar: string; // Emoji
  imageUrl?: string;
  category?: string;
  aqi?: number;
  communityId?: string;
  createdAt?: any;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  type: 'municipal' | 'state' | 'city' | 'custom';
  state?: string;
  city?: string;
  createdBy?: string;
  joined?: boolean;
  createdAt?: any;
}
