import { Recipe, Category } from "@shared/schema";

// Static recipe data taken from your MemStorage initialization
export const staticRecipes: Recipe[] = [
  {
    id: 1,
    title: "Creamy Tuscan Garlic Chicken",
    description: "A rich and creamy Italian-inspired dish with sun-dried tomatoes and spinach.",
    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    calories: 450,
    difficulty: "Medium",
    userId: 1,
    categoryIds: [1, 2, 3],
    rating: 4.8,
    ratingCount: 24,
    createdAt: new Date("2023-01-15")
  },
  {
    id: 2,
    title: "Asian-Style Grilled Salmon",
    description: "Marinated salmon with soy sauce, ginger, and honey, grilled to perfection.",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2",
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    calories: 380,
    difficulty: "Easy",
    userId: 1,
    categoryIds: [1, 4],
    rating: 4.9,
    ratingCount: 32,
    createdAt: new Date("2023-01-20")
  },
  {
    id: 3,
    title: "Vegetable Stir Fry",
    description: "A quick and healthy mix of fresh vegetables stir-fried with a savory sauce.",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    prepTime: 15,
    cookTime: 10,
    servings: 4,
    calories: 250,
    difficulty: "Easy",
    userId: 1,
    categoryIds: [1, 5],
    rating: 4.5,
    ratingCount: 18,
    createdAt: new Date("2023-02-05")
  },
  {
    id: 4,
    title: "Chocolate Chip Cookies",
    description: "Classic homemade cookies with gooey chocolate chips and a soft center.",
    imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
    prepTime: 20,
    cookTime: 12,
    servings: 24,
    calories: 180,
    difficulty: "Easy",
    userId: 1,
    categoryIds: [6, 7],
    rating: 4.7,
    ratingCount: 42,
    createdAt: new Date("2023-02-10")
  },
  {
    id: 5,
    title: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish with crispy pancetta, egg yolks, and cheese.",
    imageUrl: "https://images.unsplash.com/photo-1588013273468-315fd88ea34c",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    calories: 550,
    difficulty: "Medium",
    userId: 1,
    categoryIds: [2, 3],
    rating: 4.9,
    ratingCount: 38,
    createdAt: new Date("2023-03-01")
  },
  {
    id: 6,
    title: "Beef and Vegetable Soup",
    description: "Hearty soup with tender beef chunks and seasonal vegetables in a rich broth.",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554",
    prepTime: 20,
    cookTime: 60,
    servings: 6,
    calories: 320,
    difficulty: "Medium",
    userId: 1,
    categoryIds: [1, 8],
    rating: 4.6,
    ratingCount: 21,
    createdAt: new Date("2023-03-15")
  },
  {
    id: 7,
    title: "Avocado Toast with Poached Egg",
    description: "Creamy avocado on toasted bread topped with a perfectly poached egg.",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    prepTime: 10,
    cookTime: 5,
    servings: 1,
    calories: 280,
    difficulty: "Easy",
    userId: 1,
    categoryIds: [1, 5, 9],
    rating: 4.5,
    ratingCount: 15,
    createdAt: new Date("2023-04-01")
  }
];

// Static category data
export const staticCategories: Category[] = [
  {
    id: 1,
    name: "Healthy",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    recipeCount: 5
  },
  {
    id: 2,
    name: "Quick Meals",
    imageUrl: "https://images.unsplash.com/photo-1497888329096-51c27beff665",
    recipeCount: 3
  },
  {
    id: 3,
    name: "Italian",
    imageUrl: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b",
    recipeCount: 2
  },
  {
    id: 4,
    name: "Seafood",
    imageUrl: "https://images.unsplash.com/photo-1579767867124-d740f61cd1c9",
    recipeCount: 1
  },
  {
    id: 5,
    name: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    recipeCount: 2
  },
  {
    id: 6,
    name: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
    recipeCount: 1
  },
  {
    id: 7,
    name: "Baking",
    imageUrl: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d",
    recipeCount: 1
  },
  {
    id: 8,
    name: "Comfort Food",
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554",
    recipeCount: 1
  },
  {
    id: 9,
    name: "Breakfast",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8",
    recipeCount: 1
  }
];

// Helper function to filter and sort recipes based on criteria
export function filterAndSortStaticRecipes(
  recipes: Recipe[],
  filters: string[],
  sortOption: string,
  limit: number
): Recipe[] {
  // First filter the recipes
  let filteredRecipes = recipes;
  
  if (filters && filters.length > 0 && filters[0] !== '') {
    filteredRecipes = recipes.filter(recipe => {
      // Get category names for this recipe
      const recipeCategoryNames = recipe.categoryIds.map(catId => {
        const category = staticCategories.find(cat => cat.id === catId);
        return category ? category.name : '';
      });
      
      // Check if any of the filter categories match
      return filters.some(filter => recipeCategoryNames.includes(filter));
    });
  }
  
  // Then sort them
  if (sortOption) {
    switch (sortOption) {
      case 'popular':
        filteredRecipes.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'time':
        filteredRecipes.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
        break;
      case 'difficulty':
        const difficultyValue = (diff: string): number => {
          switch (diff.toLowerCase()) {
            case 'easy': return 1;
            case 'medium': return 2;
            case 'hard': return 3;
            default: return 0;
          }
        };
        filteredRecipes.sort((a, b) => difficultyValue(a.difficulty) - difficultyValue(b.difficulty));
        break;
      default:
        break;
    }
  }
  
  // Finally limit the number of results
  return filteredRecipes.slice(0, limit);
}