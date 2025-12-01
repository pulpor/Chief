import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { MealDBRecipe, DrinkDBRecipe } from '@/types/themealdb';

interface RecipeCardAPIProps {
  recipe: MealDBRecipe | DrinkDBRecipe;
  type: 'meals' | 'drinks';
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

const isMeal = (recipe: MealDBRecipe | DrinkDBRecipe): recipe is MealDBRecipe => {
  return 'strMeal' in recipe;
};

export const RecipeCardAPI = ({ recipe, type, onClick, isFavorite = false, onToggleFavorite }: RecipeCardAPIProps) => {
  const title = isMeal(recipe) ? recipe.strMeal : recipe.strDrink;
  const image = isMeal(recipe) ? recipe.strMealThumb : recipe.strDrinkThumb;
  const category = recipe.strCategory;
  const id = isMeal(recipe) ? recipe.idMeal : recipe.idDrink;

  return (
    <Card
      className="group relative overflow-hidden cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl"
      onClick={onClick}
    >
      {/* Image Container with Overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg opacity-100 transition-all z-10"
            onClick={onToggleFavorite}
          >
            <Heart 
              className={`h-5 w-5 transition-all ${
                isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-700'
              }`}
            />
          </Button>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {/* Category Badge */}
          <Badge 
            variant="secondary" 
            className="mb-3 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 text-xs font-semibold px-3 py-1"
          >
            {category}
          </Badge>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 drop-shadow-lg leading-tight">
            {title}
          </h3>

          {/* Type Badge */}
          <Badge 
            variant="default" 
            className={`text-xs font-medium px-3 py-1 ${
              type === 'meals' 
                ? 'bg-primary/90 hover:bg-primary text-primary-foreground' 
                : 'bg-secondary/90 hover:bg-secondary text-secondary-foreground'
            }`}
          >
            {type === 'meals' ? '🍽️ Receita' : '🍹 Drink'}
          </Badge>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-all duration-500 pointer-events-none" />
    </Card>
  );
};
