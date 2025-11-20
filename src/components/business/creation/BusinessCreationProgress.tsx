import { Check } from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
}

interface BusinessCreationProgressProps {
  currentStep: number
  steps: Step[]
}

export function BusinessCreationProgress({
  currentStep,
  steps,
}: BusinessCreationProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-2">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id
          const isActive = currentStep === step.id

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`flex items-center justify-center w-10 h-10 shrink-0 rounded-full transition-all duration-200 ${
                    isCompleted || isActive
                      ? 'bg-primary text-white'
                      : 'bg-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center max-w-[120px]">
                  <p
                    className={`text-xs font-medium ${
                      isActive || isCompleted
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className="flex-1 mx-4 mt-5 relative"
                  style={{ top: '-1.25rem' }}
                >
                  <div
                    className={`h-1 w-full transition-all duration-200 ${
                      isCompleted ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium text-foreground">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
