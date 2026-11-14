import { Employee, CompanyWebsite, MediaItem, Announcement } from '../types';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    name: 'विशाल कुमार (Boss / CEO)',
    rollNumber: 'FAV-001',
    mobileNumber: '9876543210',
    aadhaarNumber: '4589-1234-5678',
    role: 'Chief Executive Officer & Founder',
    department: 'Management & AI Architecture',
    salary: 250000,
    joiningDate: '2024-01-01',
    email: 'boss@freeaivishal.com',
    address: 'HQ Tower, Sector 62, Noida, India',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-101',
    name: 'राहुल शर्मा',
    rollNumber: 'FAV-101',
    mobileNumber: '9123456789',
    aadhaarNumber: '2341-8901-2345',
    role: 'Senior AI Engineer',
    department: 'Engineering & Development',
    salary: 95000,
    joiningDate: '2024-03-15',
    email: 'rahul.sharma@freeaivishal.com',
    address: 'Flat 402, Sunshine Apartments, Delhi',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-102',
    name: 'प्रिया सिंह',
    rollNumber: 'FAV-102',
    mobileNumber: '9988776655',
    aadhaarNumber: '7890-1234-5612',
    role: 'Lead UI/UX Designer',
    department: 'Design & Branding',
    salary: 85000,
    joiningDate: '2024-05-10',
    email: 'priya.singh@freeaivishal.com',
    address: 'House 12, MG Road, Bangalore',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-103',
    name: 'अमित कुमार वर्मा',
    rollNumber: 'FAV-103',
    mobileNumber: '9765432109',
    aadhaarNumber: '6543-2109-8765',
    role: 'Full Stack Developer',
    department: 'Software Engineering',
    salary: 78000,
    joiningDate: '2024-07-01',
    email: 'amit.verma@freeaivishal.com',
    address: 'Near Shiv Mandir, Patna, Bihar',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'emp-104',
    name: 'नेहा गुप्ता',
    rollNumber: 'FAV-104',
    mobileNumber: '9555443322',
    aadhaarNumber: '3322-1144-5566',
    role: 'HR & Operations Manager',
    department: 'Human Resources',
    salary: 70000,
    joiningDate: '2024-08-20',
    email: 'neha.gupta@freeaivishal.com',
    address: 'Civil Lines, Jaipur, Rajasthan',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_WEBSITES: CompanyWebsite[] = [
  {
    id: 'web-1',
    title: 'फ्री एआई विशाल एडवांस टूल (1st Website)',
    url: 'https://freeaivishaladvancetool88.ai.studio/',
    category: 'AI Tools',
    description: 'फ्री एआई विशाल कंपनी का आधिकारिक और मुख्य एडवांस एआई टूल पोर्टल।',
    iconName: 'Cpu',
    status: 'active'
  },
  {
    id: 'web-2',
    title: 'विशाल एंटरप्राइज एंड फर्नीचर (2nd Website)',
    url: 'https://vishalenterprise-887.ai.studio',
    category: 'E-Commerce',
    description: 'Best Furniture Shop in Amroli Surat | Doors, home furnishings, and custom furniture solutions.',
    iconName: 'ShoppingBag',
    status: 'active'
  },
  {
    id: 'web-3',
    title: 'Free AI Studio Main Hub',
    url: 'https://ai.google.dev',
    category: 'AI Tools',
    description: 'Central AI development platform for running high-speed neural models and applications.',
    iconName: 'Cpu',
    status: 'active'
  },
  {
    id: 'web-4',
    title: 'Vishal Cloud Storage & Server',
    url: 'https://cloud.google.com',
    category: 'Cloud & Hosting',
    description: 'Enterprise grade cloud infrastructure and secure data hosting for company files.',
    iconName: 'Cloud',
    status: 'active'
  },
  {
    id: 'web-5',
    title: 'Vishal Code Generator IDE',
    url: 'https://github.com',
    category: 'Development',
    description: 'Collaborative source code repository and automated CI/CD pipeline manager.',
    iconName: 'Code',
    status: 'active'
  },
  {
    id: 'web-6',
    title: 'Free AI Social & Media Portal',
    url: 'https://youtube.com',
    category: 'Media & Social',
    description: 'Official video broadcasting channel and community discussion boards.',
    iconName: 'Video',
    status: 'active'
  },
  {
    id: 'web-priv-1',
    title: 'FAV Secret CEO Command Vault (गुप्त पोर्टल)',
    url: 'https://freeaivishaladvancetool88.ai.studio/',
    category: 'Private & Secret',
    description: 'बॉस विशाल पटेल की व्यक्तिगत और गुप्त एआई कमांड वेबसाइट (केवल प्राइवेट पासवर्ड से अनलॉक)।',
    iconName: 'Lock',
    status: 'active',
    isPrivate: true
  },
  {
    id: 'web-priv-2',
    title: 'Vishal Private Internal Server & Database',
    url: 'https://vishalenterprise-887.ai.studio',
    category: 'Private & Secret',
    description: 'कंपनी का गोपनीय इंटरनल डेटाबेस और प्राइवेट एडमिन सर्वर पोर्टल।',
    iconName: 'Lock',
    status: 'active',
    isPrivate: true
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    title: 'फ्री एआई विशाल कंपनी - वार्षिक सम्मेलन 2026',
    type: 'banner',
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
    description: 'Annual corporate tech summit held at the Noida Headquarters showcasing next-gen AI models.',
    date: '2026-01-15'
  },
  {
    id: 'med-2',
    title: 'एआई इंजीनियरिंग टीम मीटिंग',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: 'Development team discussing prompt optimization and neural network architecture.',
    date: '2026-02-10'
  },
  {
    id: 'med-3',
    title: 'कंपनी का नया ऑफिस ब्लॉक - विजुअल वॉकथ्रू',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    description: 'Take a virtual tour of our state-of-the-art office spaces and research labs.',
    date: '2026-03-01'
  },
  {
    id: 'med-4',
    title: 'एआई इनोवेशन अवार्ड सेरेमनी',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    description: 'Honoring top performing engineers and designers of Free AI Vishal Company.',
    date: '2026-03-20'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'तिमाही बोनस की घोषणा (Quarterly Bonus Announcement)',
    content: 'फ्री एआई विशाल कंपनी के सभी मेहनती कर्मचारियों को सूचित किया जाता है कि इस तिमाही शानदार प्रदर्शन के लिए 20% अतिरिक्त बोनस वेतन के साथ दिया जाएगा।',
    date: '2026-03-25',
    priority: 'urgent',
    author: 'विशाल (CEO)'
  },
  {
    id: 'ann-2',
    title: 'नई वेबसाइट्स का इंटीग्रेशन लाइव',
    content: 'हमारी सभी 6 मुख्य कंपनियां और पोर्टल अब इस सेंट्रल पोर्टल से लिंक कर दिए गए हैं। सभी कर्मचारी अपने क्रेडेंशियल्स से लॉग इन करके एक्सेस कर सकते हैं।',
    date: '2026-03-20',
    priority: 'normal',
    author: 'एडमिन टीम'
  }
];
