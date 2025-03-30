import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { timerCircleVariants } from '@/lib/animation-utils';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, RotateCcw, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecipeTimerProps {
  initialTime: number; // time in seconds
  stepName: string;
  onComplete?: () => void;
}

const RecipeTimer: React.FC<RecipeTimerProps> = ({
  initialTime,
  stepName,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();
  
  // Convert seconds to minutes and seconds
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  // Calculate progress percentage
  const progress = (initialTime - timeLeft) / initialTime;
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isComplete) {
      setIsActive(false);
      setIsComplete(true);
      
      // Play notification sound
      const audio = new Audio('/sounds/timer-complete.mp3');
      audio.play().catch(() => {
        // Fallback if audio can't play
        console.log('Audio playback failed');
      });
      
      // Show notification
      toast({
        title: 'Timer Complete!',
        description: `${stepName} is ready!`,
        duration: 5000,
      });
      
      if (onComplete) {
        onComplete();
      }
      
      // Trigger achievement
      const achievementEvent = new CustomEvent('achievement-unlocked', {
        detail: {
          title: 'Time Keeper',
          description: 'You\'ve completed your first timed recipe step',
          icon: '⏱️',
        }
      });
      window.dispatchEvent(achievementEvent);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, isComplete, stepName, toast, onComplete, initialTime]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialTime);
    setIsComplete(false);
  };
  
  return (
    <div className="relative w-full max-w-xs mx-auto">
      <motion.div
        className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="font-medium text-primary mb-2">{stepName}</h3>
        
        <div className="relative w-36 h-36 mb-4">
          {/* Background circle */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-100" />
          
          {/* Progress circle */}
          <motion.div
            className="absolute inset-0 rounded-full border-8 border-primary origin-center"
            style={{ pathLength: progress }}
            variants={timerCircleVariants}
            initial="initial"
            animate="animate"
            custom={progress}
          />
          
          {/* Time display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-800">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
          </div>
          
          {/* Completion animation */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-green-100 rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Bell className="w-12 h-12 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTimer}
            disabled={isComplete}
            className="flex items-center"
          >
            {isActive ? <PauseCircle className="mr-1 h-4 w-4" /> : <PlayCircle className="mr-1 h-4 w-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetTimer}
            className="flex items-center"
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecipeTimer;