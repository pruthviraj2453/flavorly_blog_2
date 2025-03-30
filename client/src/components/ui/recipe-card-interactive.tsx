import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Clock, 
  ChefHat, 
  Users, 
  BookmarkPlus, 
  BookmarkCheck, 
  Heart, 
  Share2 
} from 'lucide-react';
import { Recipe } from '@shared/schema';
import RecipeRating from '@/components/ui/recipe-rating';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useRecipeService } from '@/lib/recipe-service';
import { useToast } from '@/hooks/use-toast';

interface RecipeCardInteractiveProps {
  recipe: Recipe;
  variant?: 'default' | 'featured';
  isLoggedIn?: boolean;
  userId?: number;
  isSaved?: boolean;
  className?: string;
  delay?: number;
}

const RecipeCardInteractive: React.FC<RecipeCardInteractiveProps> = ({
  recipe,
  variant = 'default',
  isLoggedIn = false,
  userId = 1, // Demo user ID
  isSaved: initialIsSaved = false,
  className,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likes, setLikes] = useState(recipe.likes || 0);
  const { saveRecipe, removeSavedRecipe } = useRecipeService();
  const { toast } = useToast();
  
  const isFeatured = variant === 'featured';
  
  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoggedIn) {
      try {
        if (isSaved) {
          await removeSavedRecipe(userId, recipe.id);
          setIsSaved(false);
          toast({
            title: 'Recipe removed',
            description: 'Recipe has been removed from your saved collection',
          });
        } else {
          await saveRecipe(userId, recipe.id);
          setIsSaved(true);
          toast({
            title: 'Recipe saved!',
            description: 'Recipe has been added to your saved collection',
          });
          
          // Trigger achievement if it's the first time
          const achievementEvent = new CustomEvent('achievement-unlocked', {
            detail: {
              title: 'Collector',
              description: 'You\'ve saved your first recipe',
              icon: '📚',
            }
          });
          window.dispatchEvent(achievementEvent);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'There was an error updating your saved recipes',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save recipes',
      });
    }
  };
  
  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoggedIn) {
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
      
      toast({
        title: isLiked ? 'Like removed' : 'Recipe liked!',
        description: isLiked 
          ? 'You\'ve removed your like from this recipe'
          : 'Thanks for liking this recipe!',
      });
    } else {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like recipes',
      });
    }
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this amazing recipe: ${recipe.title}`,
        url: window.location.origin + '/recipes/' + recipe.id,
      }).catch((error) => {
        toast({
          title: 'Error sharing',
          description: 'There was an error sharing this recipe',
        });
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + '/recipes/' + recipe.id);
      toast({
        title: 'Link copied!',
        description: 'Recipe link copied to clipboard',
      });
    }
  };
  
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <motion.article
        className={cn(
          'group relative w-full rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl',
          'transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20',
          isFeatured ? 'aspect-[3/2]' : 'aspect-[5/6]',
          className
        )}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: delay * 0.1,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
      >
        {/* Image */}
        <div className={cn(
          'absolute inset-0 w-full h-full bg-neutral-100',
          isFeatured ? 'aspect-video' : 'aspect-square'
        )}>
          <motion.img
            src={recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={recipe.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col space-y-2 z-10">
          <motion.button
            onClick={handleToggleSave}
            className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-primary" />
            ) : (
              <BookmarkPlus className="w-5 h-5 text-gray-700" />
            )}
          </motion.button>
          
          <motion.button
            onClick={handleToggleLike}
            className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={cn(
              "w-5 h-5 transition-colors",
              isLiked ? "text-red-500 fill-red-500" : "text-gray-700"
            )} />
          </motion.button>
          
          <motion.button
            onClick={handleShare}
            className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </motion.button>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          {/* Recipe meta */}
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.categories?.map((cat, idx) => (
              <Badge key={idx} variant="secondary" className="bg-white/90 text-gray-800">
                {cat}
              </Badge>
            ))}
          </div>
          
          {/* Recipe title */}
          <motion.h3 
            className={cn(
              "font-display font-bold leading-tight text-white drop-shadow-sm mb-2",
              isFeatured ? "text-2xl" : "text-xl"
            )}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {recipe.title}
          </motion.h3>
          
          {/* Recipe info */}
          <div className="flex items-center gap-4 text-white/90 text-sm mb-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{recipe.cookingTimeMinutes} min</span>
            </div>
            <div className="flex items-center">
              <ChefHat className="w-4 h-4 mr-1" />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{recipe.servings}</span>
            </div>
          </div>
          
          {/* Rating */}
          <div className="flex items-center justify-between">
            <RecipeRating initialRating={recipe.rating || 0} readonly size="sm" />
            <span className="text-white/90 text-sm">{likes} likes</span>
          </div>
          
          {/* View button (appears on hover) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button size="sm" className="w-full">
                  View Recipe
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>
    </Link>
  );
};

export default RecipeCardInteractive;