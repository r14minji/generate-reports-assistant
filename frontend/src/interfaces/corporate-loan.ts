export interface DataItem {
  label: string;
  value: string;
  icon: string;
}

export interface RiskItem {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
  content: string;
  removed?: boolean;
}

export interface ChatMessage {
  content: string;
  sender: 'user' | 'ai';
}

export interface ReportSection {
  title: string;
  content: string;
}

export interface IndustryOption {
  code: string;
  name: string;
}

export type ScreenType = 'dashboard' | 'upload' | 'extraction' | 'analysis' | 'report' | 'final';