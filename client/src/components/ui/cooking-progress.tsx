import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronsUpDown, CheckCircle, Circle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Step } from '@shared/schema';
import RecipeTimer from './recipe-timer';
import { cn } from '@/lib/utils';
import { pulse } from '@/lib/animation-utils';
import { useToast } from '@/hooks/use-toast';

interface CookingProgressProps {
  steps: Step[];
  onComplete?: () => void;
}

const CookingProgress: React.FC<CookingProgressProps> = ({
  steps,
  onComplete,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();
  
  const totalSteps = steps.length;
  const progress = (completedSteps.length / totalSteps) * 100;
  
  useEffect(() => {
    if (completedSteps.length === totalSteps && totalSteps > 0) {
      setShowConfetti(true);
      
      if (onComplete) {
        onComplete();
      }
      
      toast({
        title: 'Congratulations!',
        description: 'You\'ve completed all steps of this recipe!',
      });
      
      // Trigger achievement
      const achievementEvent = new CustomEvent('achievement-unlocked', {
        detail: {
          title: 'Chef Master',
          description: 'You\'ve completed your first recipe',
          icon: '👨‍🍳',
        }
      });
      window.dispatchEvent(achievementEvent);
      
      // Hide confetti after 5 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [completedSteps, totalSteps, onComplete, toast]);
  
  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };
  
  const toggleStepCompletion = (stepIndex: number) => {
    if (completedSteps.includes(stepIndex)) {
      setCompletedSteps(completedSteps.filter(step => step !== stepIndex));
    } else {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };
  
  return (
    <div className="relative bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold text-lg">Cooking Progress</h3>
          <p className="text-sm text-gray-500">
            {completedSteps.length} of {totalSteps} steps completed
          </p>
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>
      
      {/* Steps list */}
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <div className="p-4 divide-y">
            {steps.map((step, index) => (
              <div key={step.id} className="py-4">
                <div 
                  className={cn(
                    "flex items-start gap-3 cursor-pointer",
                    currentStep === index ? "opacity-100" : "opacity-80"
                  )}
                  onClick={() => handleStepClick(index)}
                >
                  <button
                    className="mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStepCompletion(index);
                    }}
                  >
                    {completedSteps.includes(index) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : currentStep === index ? (
                      <motion.div animate={pulse}>
                        <Circle className="h-5 w-5 text-primary" />
                      </motion.div>
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h4 
                      className={cn(
                        "font-medium mb-1 transition-all",
                        completedSteps.includes(index) && "line-through text-gray-500",
                        currentStep === index && !completedSteps.includes(index) && "text-primary font-semibold"
                      )}
                    >
                      Step {index + 1}: {step.title || `Step ${index + 1}`}
                    </h4>
                    <p 
                      className={cn(
                        "text-sm",
                        completedSteps.includes(index) && "text-gray-400",
                        currentStep === index && !completedSteps.includes(index) && "text-gray-800"
                      )}
                    >
                      {step.instructions}
                    </p>
                    
                    {/* Timer if step has duration */}
                    {step.durationMinutes && currentStep === index && !completedSteps.includes(index) && (
                      <div className="mt-4">
                        <RecipeTimer 
                          initialTime={step.durationMinutes * 60} 
                          stepName={step.title || `Step ${index + 1}`}
                          onComplete={() => toggleStepCompletion(index)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Confetti overlay */}
      {showConfetti && (
        <motion.div 
          className="absolute inset-0 pointer-events-none z-10 bg-confetti"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
};

export default CookingProgress;