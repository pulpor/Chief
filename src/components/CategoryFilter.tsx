import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/themealdb';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  onSelectCategory: (category?: string) => void;
  isLoading?: boolean;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  isLoading,
}: CategoryFilterProps) => {
  if (isLoading) {
    return (
      <div className="flex gap-2 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-24 bg-muted rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-4">
        <Button
          variant={!selectedCategory ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelectCategory(undefined)}
          className="transition-all"
        >
          Todas
        </Button>
        {categories.map((category) => (
          <Button
            key={category.idCategory}
            variant={selectedCategory === category.strCategory ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelectCategory(category.strCategory)}
            className="transition-all whitespace-nowrap"
          >
            {category.strCategory}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
