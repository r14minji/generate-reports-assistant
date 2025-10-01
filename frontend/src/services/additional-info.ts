import { httpClient } from "../lib/axios";

export interface SuggestedField {
  id: string;
  label: string;
  description: string;
  type: "text" | "number" | "textarea" | "date";
  required: boolean;
  placeholder?: string;
}

export interface IndustryInsight {
  title: string;
  content: string;
  type: "positive" | "negative" | "neutral";
}

export interface AdditionalInfoSuggestion {
  document_id: number;
  industry: string;
  ai_reason: string;
  industry_outlook?: string;
  insights?: IndustryInsight[];
  suggested_fields: SuggestedField[];
}

export interface CustomFields {
  special_considerations?: string;
  management_evaluation?: string;
  other_notes?: string;
}

export interface CollateralData {
  type: "담보" | "신용" | "기타";
  appraisal_value?: string;
  auction_rate?: string;
  senior_lien?: string;
  co_lien_share?: string;
  our_allocation?: string;
  recovery_expected?: string;
  recovery_amount?: string;
  loss_amount?: string;
  loss_opinion?: string;
}

export interface AdditionalInfoInput {
  document_id: number;
  field_data: Record<string, string>;
  custom_fields?: CustomFields;
  collateral_data?: CollateralData;
}

export interface AdditionalInfoSaved {
  id: number;
  document_id: number;
  field_data: Record<string, string>;
  custom_fields?: CustomFields;
  collateral_data?: CollateralData;
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
    fieldData: Record<string, string>,
    customFields?: CustomFields,
    collateralData?: CollateralData
  ): Promise<AdditionalInfoSaved> => {
    const payload: AdditionalInfoInput = {
      document_id: documentId,
      field_data: fieldData,
      custom_fields: customFields,
      collateral_data: collateralData,
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
    fieldData: Record<string, string>,
    customFields?: CustomFields,
    collateralData?: CollateralData
  ): Promise<AdditionalInfoSaved> => {
    const payload: AdditionalInfoInput = {
      document_id: documentId,
      field_data: fieldData,
      custom_fields: customFields,
      collateral_data: collateralData,
    };

    return httpClient.put<AdditionalInfoSaved, AdditionalInfoInput>(
      `/api/additional-info/${documentId}`,
      payload
    );
  },
};