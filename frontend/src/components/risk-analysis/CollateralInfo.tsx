interface CollateralData {
  type: "담보" | "신용" | "기타";
  appraisalValue: string;
  auctionRate: string;
  seniorLien: string;
  coLienShare: string;
  ourAllocation: string;
  recoveryExpected: string;
  recoveryAmount: string;
  lossAmount: string;
  lossOpinion: string;
}

interface CollateralInfoProps {
  collateralType: "담보" | "신용" | "기타";
  collateralData: CollateralData;
  onTypeChange: (type: "담보" | "신용" | "기타") => void;
  onDataChange: (field: keyof CollateralData, value: string) => void;
}

export default function CollateralInfo({
  collateralType,
  collateralData,
  onTypeChange,
  onDataChange,
}: CollateralInfoProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        담보 정보 및 회수 예상가 산출
      </h3>

      {/* Collateral Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          담보 유형
        </label>
        <div className="flex space-x-4">
          {(["담보", "신용", "기타"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                onTypeChange(type);
                onDataChange("type", type);
              }}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                collateralType === type
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Recovery Calculation Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                항목
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액 / 내용
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                감정가
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={collateralData.appraisalValue}
                  onChange={(e) =>
                    onDataChange("appraisalValue", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="감정가를 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                적용낙찰가율
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={collateralData.auctionRate}
                  onChange={(e) => onDataChange("auctionRate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="적용낙찰가율을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                선순위
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={collateralData.seniorLien}
                  onChange={(e) => onDataChange("seniorLien", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="선순위 금액을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                동순위 당사 지분
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={collateralData.coLienShare}
                  onChange={(e) => onDataChange("coLienShare", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="동순위 당사 지분을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                당사 배분액
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={collateralData.ourAllocation}
                  onChange={(e) =>
                    onDataChange("ourAllocation", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="당사 배분액을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                회수예상
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={collateralData.recoveryExpected}
                  onChange={(e) =>
                    onDataChange("recoveryExpected", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="회수예상액을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                회수액
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={collateralData.recoveryAmount}
                  onChange={(e) =>
                    onDataChange("recoveryAmount", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="회수액을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                손실액
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={collateralData.lossAmount}
                  onChange={(e) => onDataChange("lossAmount", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="손실액을 입력하세요"
                />
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                손실예상액 발생시 의견
              </td>
              <td className="px-4 py-3">
                <textarea
                  value={collateralData.lossOpinion}
                  onChange={(e) => onDataChange("lossOpinion", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="손실예상액 발생시 의견을 입력하세요"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
