export interface Employee {
  id: string;
  name: string;
  rollNumber: string;
  mobileNumber: string;
  aadhaarNumber: string;
  role: string;
  department: string;
  salary: number;
  employmentType?: string;
  joiningDate: string;
  email: string;
  address: string;
  photoUrl: string;
}

export interface CompanyWebsite {
  id: string;
  title: string;
  url: string;
  category: 'AI Tools' | 'E-Commerce' | 'Cloud & Hosting' | 'Development' | 'Media & Social' | 'Private & Secret';
  description: string;
  iconName: string;
  status: 'active' | 'maintenance';
  isPrivate?: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'photo' | 'video' | 'banner';
  url: string;
  description: string;
  date: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: 'normal' | 'urgent';
  author: string;
}

export type UserRole = 'guest' | 'employee' | 'admin';

export interface AuthState {
  role: UserRole;
  employee?: Employee;
}

export interface SupportReport {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  date: string;
}

