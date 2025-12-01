import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, ExternalLink, MapPin, Tag, Heart } from 'lucide-react';
import { getMealById, getDrinkById } from '@/services/themealdb';
import { MealDBRecipe, DrinkDBRecipe } from '@/types/themealdb';
import { Button } from '@/components/ui/button';

interface RecipeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipeId: string;
  type: 'meals' | 'drinks';
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const RecipeDetailsDialog = ({
  open,
  onOpenChange,
  recipeId,
  type,
  isFavorite = false,
  onToggleFavorite,
}: RecipeDetailsDialogProps) => {
  const [recipe, setRecipe] = useState<MealDBRecipe | DrinkDBRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!open || !recipeId) return;

      setIsLoading(true);
      try {
        const data = type === 'meals' 
          ? await getMealById(recipeId)
          : await getDrinkById(recipeId);
        setRecipe(data);
      } catch (error) {
        console.error('Error loading recipe details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [open, recipeId, type]);

  const getIngredients = (recipe: MealDBRecipe | DrinkDBRecipe) => {
    const ingredients: { ingredient: string; measure: string }[] = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}` as keyof typeof recipe];
      const measure = recipe[`strMeasure${i}` as keyof typeof recipe];
      
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push({
          ingredient: ingredient as string,
          measure: measure as string || '',
        });
      }
    }
    
    return ingredients;
  };

  const isMeal = (recipe: MealDBRecipe | DrinkDBRecipe): recipe is MealDBRecipe => {
    return 'strMeal' in recipe;
  };

  if (!recipe || isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const title = isMeal(recipe) ? recipe.strMeal : recipe.strDrink;
  const image = isMeal(recipe) ? recipe.strMealThumb : recipe.strDrinkThumb;
  const category = recipe.strCategory;
  const instructions = recipe.strInstructions;
  const tags = recipe.strTags?.split(',').filter(Boolean) || [];
  const ingredients = getIngredients(recipe);
  
  // Type-specific fields
  const area = isMeal(recipe) ? recipe.strArea : null;
  const alcoholic = !isMeal(recipe) ? recipe.strAlcoholic : null;
  const glass = !isMeal(recipe) ? recipe.strGlass : null;
  const youtube = isMeal(recipe) ? recipe.strYoutube : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          {/* Header Image */}
          <div className="relative h-64 md:h-80 w-full">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Favorite Button */}
            {onToggleFavorite && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 rounded-full"
                onClick={onToggleFavorite}
              >
                <Heart 
                  className={`h-5 w-5 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
              </Button>
            )}

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <DialogHeader>
                <DialogTitle className="text-2xl md:text-3xl text-white mb-2">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-white/90">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{category}</Badge>
                    {area && <Badge variant="secondary">{area}</Badge>}
                    {alcoholic && <Badge variant="secondary">{alcoholic}</Badge>}
                    {glass && <Badge variant="secondary">{glass}</Badge>}
                  </div>
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Tag className="h-4 w-4" />
                  <span className="font-medium">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="ingredients" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
                <TabsTrigger value="instructions">Preparo</TabsTrigger>
              </TabsList>

              <TabsContent value="ingredients" className="mt-4">
                <div className="space-y-3">
                  {ingredients.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <span className="font-medium text-gray-900">{item.ingredient}</span>
                      <span className="text-gray-600 font-medium">{item.measure}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="instructions" className="mt-4">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-line leading-relaxed">
                    {instructions}
                  </p>
                </div>

                {/* YouTube Link */}
                {youtube && (
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(youtube, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Assistir no YouTube
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
