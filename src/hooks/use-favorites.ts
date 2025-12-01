import { useState, useEffect } from 'react';

export type FavoriteRecipe = {
  id: string;
  type: 'meals' | 'drinks';
  title: string;
  image: string;
  category: string;
};

const STORAGE_KEY = 'chief-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipe: FavoriteRecipe) => {
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav.id === recipe.id && fav.type === recipe.type);
      if (exists) {
        return prev.filter((fav) => !(fav.id === recipe.id && fav.type === recipe.type));
      } else {
        return [...prev, recipe];
      }
    });
  };

  const isFavorite = (id: string, type: 'meals' | 'drinks') => {
    return favorites.some((fav) => fav.id === id && fav.type === type);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
};
