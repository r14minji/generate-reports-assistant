interface ReviewOpinionProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ReviewOpinion({ value, onChange }: ReviewOpinionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">심사 의견</h3>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="심사 의견을 입력하세요"
      />
    </div>
  );
}
