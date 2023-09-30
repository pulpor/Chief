import { assert } from 'vitest';

import {
  searchRecipesByIngredient,
  searchRecipesByName,
  searchRecipesByFirstLetter,
  searchDrinksByIngredient,
  searchDrinksByName,
  searchDrinksByFirstLetter,
  getDrinkById,
  getDrinks,
  getMealById,
  getMeals,
} from './utils/Api';

// Mock da função alert para capturar mensagens de erro
const mockAlert = (message: string) => {
  mockAlert.messages.push(message);
};
mockAlert.messages = [] as string[];

// Substituir a função alert pela função mockAlert
globalThis.alert = mockAlert;
const errorReq = "Sorry, we haven't found any recipes for these filters.";

describe('Testa a API', () => {
  it('retorna receitas quando pesquisadas por nome', async () => {
    const result = await searchRecipesByName('Pancakes');
    const hasPancakesRecipe = result.some((recipe) => recipe.strMeal === 'Pancakes');
    assert.isTrue(
      hasPancakesRecipe,
      'A pesquisa por "Pancakes" deve retornar pelo menos uma receita de "Pancakes".',
    );
  });
  it('deve retornar uma lista de receitas ao pesquisar por ingrediente', async () => {
    const result = await searchRecipesByIngredient('chicken');
    assert.isAbove(result.length, 0,
      'A pesquisa por ingrediente deve retornar pelo menos uma receita');
  });
  it('deve retornar uma lista de receitas ao pesquisar por nome', async () => {
    const result = await searchRecipesByName('Chicken Alfredo');
    assert.isAbove(result.length, 0, 'A pesquisa por nome deve retornar pelo menos uma receita');
  });
  it('deve retornar uma lista de receitas ao pesquisar por primeira letra', async () => {
    const result = await searchRecipesByFirstLetter('A');
    assert.isAbove(result.length, 0, 'A pesquisa por primeira letra deve retornar pelo menos uma receita');
  });
  it('deve retornar uma lista de drinks ao pesquisar por ingrediente', async () => {
    const ingredient = 'gin';
    const result = await searchDrinksByIngredient(ingredient);
    assert.isAbove(result.length, 0, 'A pesquisa por ingrediente deve retornar pelo menos um drink');
  });
  it('deve retornar uma lista de drinks ao pesquisar por nome', async () => {
    const result = await searchDrinksByName('Aquamarine');
    assert.isAbove(result.length, 0, 'A pesquisa por nome deve retornar ao menos um drink');
  });
  it('deve exibir um alerta de erro quando a pesquisa por nome não retorna resultados', async () => {
    await searchRecipesByName('xablau');
    assert.isTrue(mockAlert.messages.includes(errorReq), 'Deve exibir um alerta de erro com a mensagem certeira');
  });
  it('deve exibir um alerta de erro quando a pesquisa por primeira letra não retorna resultados', async () => {
    await searchRecipesByFirstLetter('X');
    assert.isTrue(mockAlert.messages.includes(errorReq), 'Deve exibir um alerta de erro com a mensagem correta');
  });
  it('deve exibir um alerta de erro quando a pesquisa por primeira letra não retorna resultados', async () => {
    await searchDrinksByFirstLetter('X');
    assert.isTrue(mockAlert.messages.includes(errorReq), 'Deve exibir um alerta de erro com a mensagem correta');
  });
  it('funções genericas', async () => {
    const result = await getDrinks();
    const resultById = await getDrinkById('15997');
    const resultMeal = await getMeals();
    const resultMealById = await getMealById('52977');

    assert.isAbove(result.length, 0, 'A pesquisa por nome deve retornar pelo menos um drink');
    assert.isAbove(resultById.length, 0, 'A pesquisa por nome deve retornar pelo menos um drink');
    assert.isAbove(resultMeal.length, 0, 'A pesquisa por nome deve retornar pelo menos um meal');
    assert.isAbove(resultMealById.length, 0, 'A pesquisa por nome deve retornar pelo menos um meal');
  });
});
