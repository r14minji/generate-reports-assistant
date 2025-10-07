import { useState } from "react";

interface ReviewOpinionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ReviewOpinion({ value, onChange }: ReviewOpinionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleEdit = () => {
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">심사 의견</h3>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            편집
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="심사 의견을 입력하세요"
          />
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {value ? (
            <div className="text-gray-700 whitespace-pre-wrap">{value}</div>
          ) : (
            <div className="text-gray-400 italic">심사 의견이 생성되지 않았습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
