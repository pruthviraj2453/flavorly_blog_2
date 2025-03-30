import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { flipCardVariants } from '@/lib/animation-utils';
import { RefreshCw } from 'lucide-react';

interface Substitute {
  name: string;
  ratio: string;
  description: string;
}

interface IngredientSubstitutionProps {
  ingredient: string;
  substitutes: Substitute[];
}

const IngredientSubstitution: React.FC<IngredientSubstitutionProps> = ({
  ingredient,
  substitutes,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentSubstitute, setCurrentSubstitute] = useState<Substitute | null>(
    substitutes.length > 0 ? substitutes[0] : null
  );
  const [substitutionIndex, setSubstitutionIndex] = useState(0);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const cycleSubstitutes = () => {
    const nextIndex = (substitutionIndex + 1) % substitutes.length;
    setSubstitutionIndex(nextIndex);
    setCurrentSubstitute(substitutes[nextIndex]);
  };

  if (!currentSubstitute) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.span
          className="underline cursor-pointer text-primary dotted-underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {ingredient}
        </motion.span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-transparent border-none shadow-none">
        <motion.div 
          className="relative w-full h-full perspective"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence initial={false} mode="wait">
            {isFlipped ? (
              <motion.div
                key="back"
                className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg p-4"
                variants={flipCardVariants}
                initial="hiddenBack"
                animate="visibleBack"
                exit="exitBack"
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-sm text-gray-600">SUBSTITUTION DETAILS</h3>
                  <button onClick={flipCard} className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{currentSubstitute.description}</p>
                
                <button 
                  onClick={flipCard}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Back to substitution
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="front"
                className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg p-4"
                variants={flipCardVariants}
                initial="hiddenFront"
                animate="visibleFront"
                exit="exitFront"
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800">Substitute for {ingredient}</h3>
                  <button onClick={flipCard} className="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary">{currentSubstitute.name}</span>
                    <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {currentSubstitute.ratio}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={flipCard}
                    className="text-gray-600 text-sm hover:text-gray-800"
                  >
                    Learn more
                  </button>
                  
                  {substitutes.length > 1 && (
                    <button 
                      onClick={cycleSubstitutes}
                      className="flex items-center text-primary text-sm font-medium hover:underline"
                    >
                      <RefreshCw className="mr-1 w-3 h-3" />
                      Next option
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default IngredientSubstitution;