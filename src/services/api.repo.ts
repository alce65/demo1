import type { Drink } from '../types';
const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';

const filterUrl = apiUrl + 'filter.php';
const cocktailUrl = apiUrl + 'lookup.php?i=';
const rumUrl = filterUrl + '?i=rum';

type DrinkSummary = {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
};

type ApiDrink = {
    idDrink: string;
    strDrink: string;
    strDrinkAlternate: string | null;
    strTags: string[] | null;
    strVideo: string | null;
    strCategory: string;
    strIBA: string | null;
    strAlcoholic: string;
    strGlass: string;
    strInstructions: string;
    strInstructionsES: string;
    strDrinkThumb: string;
    strIngredient1: string;
    strIngredient2: string | null;
    strIngredient3: string | null;
    strIngredient4: string | null;
    strIngredient5: string | null;
    strIngredient6: string | null;
    strIngredient7: string | null;
    strIngredient8: string | null;
    strIngredient9: string | null;
    strIngredient10: string | null;
    strIngredient11: string | null;
    strIngredient12: string | null;
    strIngredient13: string | null;
    strIngredient14: string | null;
    strIngredient15: string | null;
    strMeasure1: string | null;
    strMeasure2: string | null;
    strMeasure3: string | null;
    strMeasure4: string | null;
    strMeasure5: string | null;
    strMeasure6: string | null;
    strMeasure7: string | null;
    strMeasure8: string | null;
    strMeasure9: string | null;
    strMeasure10: string | null;
    strMeasure11: string | null;
    strMeasure12: string | null;
    strMeasure13: string | null;
    strMeasure14: string | null;
    strMeasure15: string | null;
    strImageSource: string | null;
    strImageAttribution: string | null;
    strCreativeCommonsConfirmed: string;
    dateModified: string;
};

type DrinkResponse = {
    drinks: DrinkSummary[];
};

type FullDrinkResponse = {
    drinks: ApiDrink[];
};

const processDrink = (drink: ApiDrink): Drink => {
    const ingredients = Object.entries(drink)
        .filter(([key, value]) => key.startsWith('strIngredient') && value)
        .map(([key, value]) => {
            const index = key.replace('strIngredient', '');
            const object = drink as unknown as { [key: string]: string };
            const measure = object['strMeasure' + index] as string | null;
            return { ingredient: value as string, measure: measure ?? '' };
        });
    return {
        id: drink.idDrink,
        name: drink.strDrink,
        nameAlternate: drink.strDrinkAlternate ?? '',
        tags: drink.strTags ?? [],
        category: drink.strCategory,
        alcoholic: drink.strAlcoholic,
        glass: drink.strGlass,
        instructions: drink.strInstructions,
        instructionsES: drink.strInstructionsES,
        drinkThumb: drink.strDrinkThumb,
        ingredients,
        dateModified: new Date(drink.dateModified),
    };
};

export const fetchDrinkById = async (id: string) => {
    const response = await fetch(cocktailUrl + id);
    const { drinks } = (await response.json()) as FullDrinkResponse;
    return processDrink(drinks[0]);
}

export const fetchRumDrinks = async () => {
    const response = await fetch(rumUrl);
    const { drinks } = (await response.json()) as DrinkResponse;
    const cocktailsFetch = drinks.map(async ({ idDrink }) => {
        const response = await fetch(cocktailUrl + idDrink);
        return await response.json();
    });
    const drinkResponses = (await Promise.all(
        cocktailsFetch
    )) as FullDrinkResponse[];
    const result = drinkResponses.map(({ drinks }) =>
        processDrink(drinks[0])
    ) as Drink[];
    return result;
};
