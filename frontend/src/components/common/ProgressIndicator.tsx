interface Step {
  id: string;
  name: string;
  status: "completed" | "current" | "upcoming";
}

interface ProgressIndicatorProps {
  currentStep: string;
}

const steps: Step[] = [
  { id: "dashboard", name: "대시보드", status: "upcoming" },
  { id: "upload", name: "문서 업로드", status: "upcoming" },
  { id: "extraction", name: "데이터 추출", status: "upcoming" },
  { id: "additional-info", name: "추가 정보", status: "upcoming" },
  { id: "analysis", name: "위험 분석", status: "upcoming" },
  { id: "report", name: "리포트", status: "upcoming" },
];

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  const stepsWithStatus = steps.map((step, index) => ({
    ...step,
    status:
      index < currentStepIndex
        ? "completed"
        : index === currentStepIndex
          ? "current"
          : "upcoming",
  })) as Step[];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="py-4" aria-label="Progress">
          <ol className="flex items-center justify-between">
            {stepsWithStatus.map((step, stepIdx) => (
              <li
                key={step.id}
                className={`flex items-center ${stepIdx !== stepsWithStatus.length - 1 ? "flex-1" : ""}`}
              >
                <div className="flex items-center">
                  {step.status === "completed" ? (
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : step.status === "current" ? (
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
                      <span className="text-white text-sm font-medium">
                        {stepIdx + 1}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                      <span className="text-gray-500 text-sm font-medium">
                        {stepIdx + 1}
                      </span>
                    </div>
                  )}
                  <span
                    className={`ml-3 text-sm font-medium ${
                      step.status === "current"
                        ? "text-blue-600"
                        : step.status === "completed"
                          ? "text-green-600"
                          : "text-gray-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {stepIdx !== stepsWithStatus.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-0.5 ${
                        step.status === "completed"
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
