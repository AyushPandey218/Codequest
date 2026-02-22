import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'

const CodeWalkthrough = () => {
  const { questId } = useParams()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: 'Understanding the Problem',
      description: 'First, let\'s break down what we need to accomplish.',
      explanation: 'We need to calculate the nth Fibonacci number. The Fibonacci sequence starts with 0 and 1, and each subsequent number is the sum of the previous two.',
      code: `# The Fibonacci sequence:
# 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
# 
# For n = 5, the result is 5
# For n = 10, the result is 55`,
      highlighted: [],
    },
    {
      title: 'Base Cases',
      description: 'Every recursive function needs base cases to stop the recursion.',
      explanation: 'If n is 0 or 1, we simply return n. These are our stopping conditions.',
      code: `def fibonacci(n):
    if n <= 1:
        return n`,
      highlighted: [1, 2],
    },
    {
      title: 'Recursive Case',
      description: 'Now we handle the recursive case for larger values.',
      explanation: 'For any n greater than 1, we calculate fibonacci(n-1) + fibonacci(n-2). This breaks the problem into smaller subproblems.',
      code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)`,
      highlighted: [3],
    },
    {
      title: 'Testing the Solution',
      description: 'Let\'s test our implementation with a few examples.',
      explanation: 'We can verify our solution works correctly by testing with known values from the Fibonacci sequence.',
      code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test cases
print(fibonacci(0))   # Output: 0
print(fibonacci(1))   # Output: 1
print(fibonacci(5))   # Output: 5
print(fibonacci(10))  # Output: 55`,
      highlighted: [6, 7, 8, 9],
    },
    {
      title: 'Optimization (Optional)',
      description: 'The recursive solution works but can be optimized with memoization.',
      explanation: 'Memoization stores previously calculated results to avoid redundant calculations, improving time complexity from O(2^n) to O(n).',
      code: `def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

# Now much faster!
print(fibonacci(50))  # Runs instantly`,
      highlighted: [1, 2, 5, 6],
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/app/quests/${questId}`}>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-[#282839] rounded-lg transition-colors">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                arrow_back
              </span>
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Code Walkthrough
            </h1>
            <p className="text-sm text-slate-600 dark:text-text-secondary mt-1">
              Step-by-step explanation
            </p>
          </div>
        </div>
        <Badge variant="primary">
          Step {currentStep + 1} of {steps.length}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`flex-1 h-2 rounded-full transition-all ${
              index === currentStep
                ? 'bg-primary'
                : index < currentStep
                ? 'bg-green-500'
                : 'bg-slate-200 dark:bg-[#3b3b54]'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Explanation */}
        <Card variant="elevated" className="p-6">
          <div className="mb-6">
            <Badge variant="info" size="sm" className="mb-3">
              Step {currentStep + 1}
            </Badge>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-slate-600 dark:text-text-secondary">
              {currentStepData.description}
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <Card variant="bordered" className="p-4 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
                  info
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentStepData.explanation}
                </p>
              </div>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-border-dark">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              icon="arrow_back"
              iconPosition="left"
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                icon="arrow_forward"
              >
                Next Step
              </Button>
            ) : (
              <Link to={`/app/quests/${questId}`}>
                <Button variant="primary" icon="check_circle">
                  Complete Walkthrough
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Right - Code Display */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#1c1c27]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                code
              </span>
              <span className="font-medium text-slate-900 dark:text-white">
                solution.py
              </span>
            </div>
          </div>

          {/* Code Block with Syntax Highlighting */}
          <div className="bg-[#1e1e2e] p-6 pb-4 overflow-x-auto min-h-[400px]">
            <div className="font-mono text-sm">
              {currentStepData.code.split('\n').map((line, index) => {
                const isHighlighted = currentStepData.highlighted.includes(index)
                return (
                  <div
                    key={index}
                    className={`flex gap-4 py-1 px-2 rounded transition-all ${
                      isHighlighted
                        ? 'bg-yellow-500/20 border-l-2 border-yellow-500'
                        : ''
                    }`}
                  >
                    <span className="text-slate-600 dark:text-slate-500 select-none w-8 text-right flex-shrink-0">
                      {index + 1}
                    </span>
                    <pre className="text-[#c5d4dd] whitespace-pre overflow-x-auto pb-2">
                      {line}
                    </pre>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Code Actions */}
          <div className="p-4 border-t border-slate-200 dark:border-border-dark flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-text-secondary">
              <span className="material-symbols-outlined text-lg">lightbulb</span>
              <span>Highlighted lines show key concepts</span>
            </div>
            <Button variant="outline" size="sm" icon="content_copy">
              Copy Code
            </Button>
          </div>
        </Card>
      </div>

      {/* Tips Section */}
      <Card variant="elevated" className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-lg bg-purple-500 flex items-center justify-center text-white flex-shrink-0">
            <span className="material-symbols-outlined">tips_and_updates</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
              Pro Tips
            </h3>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li>• Take your time to understand each step before moving forward</li>
              <li>• Try to implement the solution yourself after completing the walkthrough</li>
              <li>• Experiment with different test cases to deepen your understanding</li>
              <li>• Review the highlighted lines to see the most important parts</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Step Navigator */}
      <Card variant="elevated" className="p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">
          All Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`p-4 rounded-xl text-left transition-all ${
                index === currentStep
                  ? 'bg-primary text-white'
                  : index < currentStep
                  ? 'bg-green-500/10 border border-green-500/20 hover:bg-green-500/20'
                  : 'bg-slate-100 dark:bg-[#282839] hover:bg-slate-200 dark:hover:bg-[#323267]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`material-symbols-outlined text-lg ${
                  index === currentStep
                    ? 'text-white'
                    : index < currentStep
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {index < currentStep ? 'check_circle' : index === currentStep ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
                <span className={`text-xs font-bold ${
                  index === currentStep
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  Step {index + 1}
                </span>
              </div>
              <p className={`text-sm font-medium ${
                index === currentStep
                  ? 'text-white'
                  : 'text-slate-900 dark:text-white'
              }`}>
                {step.title}
              </p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default CodeWalkthrough
