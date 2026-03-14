import React from 'react'
import { Check } from 'lucide-react'

export interface WizardStepsProps {
  steps: string[]
  currentStep: number // 0-indexed
}

const WizardSteps: React.FC<WizardStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      {/* Desktop: Horizontal layout */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center flex-1">
                {/* Circle indicator */}
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-primary border-primary text-white'
                        : isCurrent
                          ? 'border-secondary bg-secondary/10 text-secondary'
                          : 'border-border bg-white text-text-muted'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`
                    mt-2 text-sm font-medium text-center
                    ${
                      isCompleted || isCurrent
                        ? 'text-text-high'
                        : 'text-text-muted'
                    }
                  `}
                >
                  {step}
                </span>
              </div>

              {/* Connector line (except for last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-4 transition-all duration-200
                    ${isCompleted ? 'bg-primary' : 'bg-border'}
                  `}
                  style={{ marginBottom: '2.5rem' }}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Mobile: Vertical layout */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep

          return (
            <div key={step} className="flex items-start">
              {/* Circle indicator + connector */}
              <div className="flex flex-col items-center mr-4">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-primary border-primary text-white'
                        : isCurrent
                          ? 'border-secondary bg-secondary/10 text-secondary'
                          : 'border-border bg-white text-text-muted'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Vertical connector line (except for last step) */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-0.5 h-8 mt-2 transition-all duration-200
                      ${isCompleted ? 'bg-primary' : 'bg-border'}
                    `}
                  />
                )}
              </div>

              {/* Step label */}
              <div className="flex-1 pt-1">
                <span
                  className={`
                    text-sm font-medium
                    ${
                      isCompleted || isCurrent
                        ? 'text-text-high'
                        : 'text-text-muted'
                    }
                  `}
                >
                  {step}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WizardSteps
