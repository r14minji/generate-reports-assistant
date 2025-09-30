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

export interface SuggestedField {
  id: string;
  label: string;
  description: string;
  type: 'text' | 'number' | 'textarea' | 'date';
  required: boolean;
  placeholder?: string;
}

export interface AdditionalInfoData {
  industry: string;
  suggestedFields: SuggestedField[];
  aiReason: string;
}

export type ScreenType = 'dashboard' | 'upload' | 'extraction' | 'additional-info' | 'analysis' | 'report' | 'final';