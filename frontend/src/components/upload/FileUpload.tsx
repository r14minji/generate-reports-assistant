import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { documentsService, DocumentUploadResponse } from "../../services/documents";

interface FileUploadProps {
  onUploadSuccess: (response: DocumentUploadResponse) => void;
  onUploadError?: (error: string) => void;
}

export default function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // 파일 크기 검증 (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = "파일 크기는 50MB를 초과할 수 없습니다.";
      onUploadError?.(errorMsg);
      return;
    }

    // 파일 형식 검증
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      const errorMsg = "지원하지 않는 파일 형식입니다. PDF, DOCX, PPT, 이미지 파일만 업로드 가능합니다.";
      onUploadError?.(errorMsg);
      return;
    }

    try {
      setUploading(true);
      const response = await documentsService.uploadDocument(file);
      onUploadSuccess(response);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "파일 업로드에 실패했습니다.";
      onUploadError?.(errorMsg);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 cursor-pointer ${
          dragOver
            ? "border-blue-400 bg-blue-100"
            : uploading
            ? "border-gray-300 bg-gray-100 cursor-wait"
            : "border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-300"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
          disabled={uploading}
        />

        {uploading ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-pulse">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              업로드 중...
            </h3>
            <p className="text-sm text-gray-600">잠시만 기다려주세요</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              문서 업로드
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              사업계획서를 드래그하거나 클릭하여 업로드하세요
            </p>
            <div className="text-xs text-gray-500">
              <p>지원 형식: PDF, DOCX, PPT, 이미지</p>
              <p>최대 파일 크기: 50MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}