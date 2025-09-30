import { httpClient } from "../lib/axios";

export interface SuggestedField {
  id: string;
  label: string;
  description: string;
  type: "text" | "number" | "textarea" | "date";
  required: boolean;
  placeholder?: string;
}

export interface AdditionalInfoSuggestion {
  document_id: number;
  industry: string;
  ai_reason: string;
  suggested_fields: SuggestedField[];
}

export interface AdditionalInfoInput {
  document_id: number;
  field_data: Record<string, string>;
}

export interface AdditionalInfoSaved {
  id: number;
  document_id: number;
  field_data: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export const additionalInfoService = {
  // AI가 산업 분석 후 필요한 추가 정보 제안
  getSuggestedFields: async (
    documentId: number
  ): Promise<AdditionalInfoSuggestion> => {
    return httpClient.get<AdditionalInfoSuggestion>(
      `/api/additional-info/${documentId}/suggestions`
    );
  },

  // 추가 정보 저장
  saveAdditionalInfo: async (
    documentId: number,
    fieldData: Record<string, string>
  ): Promise<AdditionalInfoSaved> => {
    const payload: AdditionalInfoInput = {
      document_id: documentId,
      field_data: fieldData,
    };

    return httpClient.post<AdditionalInfoSaved, AdditionalInfoInput>(
      `/api/additional-info/${documentId}`,
      payload
    );
  },

  // 저장된 추가 정보 조회
  getAdditionalInfo: async (
    documentId: number
  ): Promise<AdditionalInfoSaved> => {
    return httpClient.get<AdditionalInfoSaved>(
      `/api/additional-info/${documentId}`
    );
  },

  // 추가 정보 수정
  updateAdditionalInfo: async (
    documentId: number,
    fieldData: Record<string, string>
  ): Promise<AdditionalInfoSaved> => {
    const payload: AdditionalInfoInput = {
      document_id: documentId,
      field_data: fieldData,
    };

    return httpClient.put<AdditionalInfoSaved, AdditionalInfoInput>(
      `/api/additional-info/${documentId}`,
      payload
    );
  },
};