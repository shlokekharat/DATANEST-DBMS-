export interface Student {
  id: string; // Roll Number / ID
  name: string;
  email: string;
  mobile: string;
  department: string;
  course: string;
  city: string;
  address: string;
  status: 'Active' | 'Inactive';
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  explanation: string;
}

export interface ActivityLog {
  id: string;
  type: 'add' | 'update' | 'delete' | 'backup';
  message: string;
  timestamp: string;
}

export interface DbmsContentItem {
  id: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  example: string;
}
