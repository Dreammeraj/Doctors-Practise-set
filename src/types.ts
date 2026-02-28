export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  subscription_status: 'active' | 'inactive';
}

export interface Question {
  id: number;
  scenario: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  specialty: string;
  format: string;
}

export interface Analytics {
  total_attempts: number;
  correct_attempts: number;
  total_questions: number;
  specialtyStats: {
    specialty: string;
    count: number;
    correct: number;
  }[];
}
