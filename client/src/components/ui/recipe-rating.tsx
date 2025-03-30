import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createConfetti } from '@/lib/animation-utils';

interface RecipeRatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RecipeRating: React.FC<RecipeRatingProps> = ({
  initialRating = 0,
  onRatingChange,
  readonly = false,
  size = 'md',
  className,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  
  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  const handleStarClick = (selectedRating: number) => {
    if (readonly) return;
    
    setRating(selectedRating);
    setHasRated(true);
    
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
    
    // Celebrate high ratings with confetti
    if (selectedRating >= 4) {
      // Trigger confetti based on rating
      createConfetti({
        particleCount: selectedRating * 20,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Trigger achievement if it's a 5-star rating
      if (selectedRating === 5) {
        const achievementEvent = new CustomEvent('achievement-unlocked', {
          detail: {
            title: 'Culinary Critic',
            description: 'You\'ve given your first 5-star rating',
            icon: '⭐',
          }
        });
        window.dispatchEvent(achievementEvent);
      }
    }
  };
  
  const handleStarHover = (hoveredValue: number) => {
    if (readonly) return;
    setHoveredRating(hoveredValue);
  };
  
  const handleMouseLeave = () => {
    if (readonly) return;
    setHoveredRating(0);
  };
  
  const displayRating = hoveredRating || rating;
  
  return (
    <div 
      className={cn('flex items-center space-x-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((starValue) => (
        <motion.button
          key={starValue}
          type="button"
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          disabled={readonly}
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          className={cn(
            'transition-colors focus:outline-none',
            readonly ? 'cursor-default' : 'cursor-pointer'
          )}
          aria-label={`Rate ${starValue} stars`}
        >
          <Star
            className={cn(
              starSizes[size],
              'transition-all duration-200',
              starValue <= displayRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300',
              !readonly && starValue <= hoveredRating && 'animate-pulse'
            )}
          />
        </motion.button>
      ))}
      
      {/* Feedback animation */}
      {hasRated && !readonly && (
        <motion.span
          className="ml-2 text-sm font-medium text-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {rating < 3 
            ? "Thanks for your feedback!" 
            : rating < 5 
              ? "Great! Thanks for rating!" 
              : "Amazing! You're awesome!"}
        </motion.span>
      )}
    </div>
  );
};

export default RecipeRating;