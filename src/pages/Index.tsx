import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, UtensilsCrossed, Wine, Loader2, ChefHat, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { RecipeCardAPI } from '@/components/RecipeCardAPI';
import { RecipeDetailsDialog } from '@/components/RecipeDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/use-favorites';
import {
  getMealCategories,
  getDrinkCategories,
  getMealsByCategory,
  getDrinksByCategory,
  getAllMeals,
  getAllDrinks,
  searchMeals,
  searchDrinks,
} from '@/services/themealdb';
import { MealDBRecipe, DrinkDBRecipe, Category, RecipeType } from '@/types/themealdb';
import heroBackground from '@/assets/hero-background.jpg';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { toast } = useToast();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<RecipeType>('meals');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  // Dialog state
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [selectedRecipeType, setSelectedRecipeType] = useState<RecipeType>('meals');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Categories
  const [mealCategories, setMealCategories] = useState<Category[]>([]);
  const [drinkCategories, setDrinkCategories] = useState<Category[]>([]);
  const [selectedMealCategory, setSelectedMealCategory] = useState<string>();
  const [selectedDrinkCategory, setSelectedDrinkCategory] = useState<string>();
  
  // Recipes
  const [meals, setMeals] = useState<MealDBRecipe[]>([]);
  const [drinks, setDrinks] = useState<DrinkDBRecipe[]>([]);
  
  // Loading states
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const [mealsData, drinksData] = await Promise.all([
          getMealCategories(),
          getDrinkCategories(),
        ]);
        setMealCategories(mealsData);
        setDrinkCategories(drinksData);
        
        // Set first category as default
        if (mealsData.length > 0) {
          setSelectedMealCategory(mealsData[0].strCategory);
        }
        if (drinksData.length > 0) {
          setSelectedDrinkCategory(drinksData[0].strCategory);
        }
      } catch (error) {
        toast({
          title: 'Erro ao carregar categorias',
          description: 'Não foi possível carregar as categorias. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [toast]);

  // Load recipes when category or tab changes
  useEffect(() => {
    const loadRecipes = async () => {
      setIsLoadingRecipes(true);
      try {
        if (activeTab === 'meals') {
          const data = selectedMealCategory 
            ? await getMealsByCategory(selectedMealCategory)
            : await getAllMeals();
          console.log(`✅ ${data.length} receitas carregadas ${selectedMealCategory ? `da categoria "${selectedMealCategory}"` : '(todas)'}`);
          setMeals(data);
        } else if (activeTab === 'drinks') {
          const data = selectedDrinkCategory
            ? await getDrinksByCategory(selectedDrinkCategory)
            : await getAllDrinks();
          console.log(`🍹 ${data.length} drinks carregados ${selectedDrinkCategory ? `da categoria "${selectedDrinkCategory}"` : '(todos)'}`);
          setDrinks(data);
        }
      } catch (error) {
        toast({
          title: 'Erro ao carregar receitas',
          description: 'Não foi possível carregar as receitas. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    loadRecipes();
  }, [activeTab, selectedMealCategory, selectedDrinkCategory, toast]);  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingRecipes(true);
    try {
      if (activeTab === 'meals') {
        const data = await searchMeals(searchQuery);
        setMeals(data);
      } else {
        const data = await searchDrinks(searchQuery);
        setDrinks(data);
      }
    } catch (error) {
      toast({
        title: 'Erro na busca',
        description: 'Não foi possível realizar a busca. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const handleRecipeClick = (id: string, type: RecipeType) => {
    setSelectedRecipeId(id);
    setSelectedRecipeType(type);
    setDialogOpen(true);
  };

  const handleToggleFavorite = (
    e: React.MouseEvent,
    recipe: MealDBRecipe | DrinkDBRecipe,
    type: RecipeType
  ) => {
    e.stopPropagation();
    
    const isMeal = 'idMeal' in recipe;
    const id = isMeal ? recipe.idMeal : recipe.idDrink;
    const title = isMeal ? recipe.strMeal : recipe.strDrink;
    const image = isMeal ? recipe.strMealThumb : recipe.strDrinkThumb;
    
    toggleFavorite({
      id,
      type,
      title,
      image,
      category: recipe.strCategory,
    });
  };

  // Reset page when changing tabs or filters
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedMealCategory, selectedDrinkCategory, showFavoritesOnly, searchQuery]);

  const currentRecipes = activeTab === 'meals' ? meals : drinks;
  
  // Filter recipes to show only favorites if enabled
  const filteredRecipes = showFavoritesOnly
    ? currentRecipes.filter((recipe) => {
        const id = 'idMeal' in recipe ? recipe.idMeal : recipe.idDrink;
        return isFavorite(id, activeTab);
      })
    : currentRecipes;

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);

  const favoritesCount = favorites.filter((fav) => fav.type === activeTab).length;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Show max 5 page numbers
    
    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always show first page
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBackground}
            alt="Fresh ingredients"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>

        <div className="relative z-10 container max-w-4xl px-4 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-primary/10 backdrop-blur-sm p-3 rounded-full">
              <ChefHat className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Explore Receitas
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              do Mundo Todo
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-6">
            Milhares de receitas e drinks
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-8 px-4">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as RecipeType)}
          className="w-full modern-tabs"
        >
          {/* Tabs Header */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <TabsList className="bg-muted/20 backdrop-blur-sm p-1.5 rounded-full border border-border/50">
                <TabsTrigger 
                  value="meals" 
                  className="gap-2 px-6 py-2.5 rounded-full font-semibold"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>Receitas</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="drinks" 
                  className="gap-2 px-6 py-2.5 rounded-full font-semibold"
                >
                  <Wine className="h-4 w-4" />
                  <span>Drinks</span>
                </TabsTrigger>
              </TabsList>

              <Button
                variant={showFavoritesOnly ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                <Heart className={showFavoritesOnly ? 'fill-current' : ''} size={16} />
                Favoritos
                {favoritesCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {favoritesCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-md">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={`Buscar ${activeTab === 'meals' ? 'receitas' : 'drinks'}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" size="default">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Meals Tab */}
          <TabsContent value="meals" className="space-y-6">
            <CategoryFilter
              categories={mealCategories}
              selectedCategory={selectedMealCategory}
              onSelectCategory={setSelectedMealCategory}
              isLoading={isLoadingCategories}
            />

            {isLoadingRecipes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredRecipes.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedRecipes.map((recipe) => {
                    const recipeId = 'idMeal' in recipe ? recipe.idMeal : recipe.idDrink;
                    return (
                      <RecipeCardAPI
                        key={recipeId}
                        recipe={recipe}
                        type="meals"
                        onClick={() => handleRecipeClick(recipeId, 'meals')}
                        isFavorite={isFavorite(recipeId, 'meals')}
                        onToggleFavorite={(e) => handleToggleFavorite(e, recipe, 'meals')}
                      />
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, idx) => 
                        typeof page === 'string' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">
                            {page}
                          </span>
                        ) : (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {showFavoritesOnly 
                    ? 'Nenhuma receita favorita ainda' 
                    : 'Nenhuma receita encontrada'}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Drinks Tab */}
          <TabsContent value="drinks" className="space-y-6">
            <CategoryFilter
              categories={drinkCategories}
              selectedCategory={selectedDrinkCategory}
              onSelectCategory={setSelectedDrinkCategory}
              isLoading={isLoadingCategories}
            />

            {isLoadingRecipes ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredRecipes.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedRecipes.map((recipe) => {
                    const recipeId = 'idDrink' in recipe ? recipe.idDrink : recipe.idMeal;
                    return (
                      <RecipeCardAPI
                        key={recipeId}
                        recipe={recipe}
                        type="drinks"
                        onClick={() => handleRecipeClick(recipeId, 'drinks')}
                        isFavorite={isFavorite(recipeId, 'drinks')}
                        onToggleFavorite={(e) => handleToggleFavorite(e, recipe, 'drinks')}
                      />
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((page, idx) => 
                        typeof page === 'string' ? (
                          <span key={`ellipsis-drinks-${idx}`} className="px-2 text-muted-foreground">
                            {page}
                          </span>
                        ) : (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        )
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  {showFavoritesOnly 
                    ? 'Nenhum drink favorito ainda' 
                    : 'Nenhum drink encontrado'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8 mt-16">
        <div className="container px-4">
          <div className="text-center text-sm text-gray-600">
            <p>© 2025 Chief. Powered with 🧡 by Leonardo Pulpor.</p>
          </div>
        </div>
      </footer>

      {/* Recipe Details Dialog */}
      {selectedRecipeId && (
        <RecipeDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          recipeId={selectedRecipeId}
          type={selectedRecipeType}
          isFavorite={isFavorite(selectedRecipeId, selectedRecipeType)}
          onToggleFavorite={() => {
            const recipe = currentRecipes.find((r) => {
              const id = 'idMeal' in r ? r.idMeal : r.idDrink;
              return id === selectedRecipeId;
            });
            
            if (recipe) {
              const isMeal = 'idMeal' in recipe;
              const id = isMeal ? recipe.idMeal : recipe.idDrink;
              const title = isMeal ? recipe.strMeal : recipe.strDrink;
              const image = isMeal ? recipe.strMealThumb : recipe.strDrinkThumb;
              
              toggleFavorite({
                id,
                type: selectedRecipeType,
                title,
                image,
                category: recipe.strCategory,
              });
            }
          }}
        />
      )}
    </div>
  );
};

export default Index;
