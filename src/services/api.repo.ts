import type { Drink } from '../types';
const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/';

const filterUrl = apiUrl + 'filter.php';
const cocktailUrl = apiUrl + 'lookup.php?i=';
const rumUrl = filterUrl + '?i=rum';

let rumDrinksCache: Drink[] | undefined;

type DrinkSummary = {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
};

type ApiDrink = {
    idDrink: string;
    strDrink: string;
    strDrinkAlternate: string | null;
    strTags: string | null;
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
    drinks: DrinkSummary[] | null;
};

type FullDrinkResponse = {
    drinks: ApiDrink[] | null;
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
        tags: drink.strTags ? drink.strTags.split(',').map((tag) => tag.trim()) : [],
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

const fetchDrinkDetails = async (id: string): Promise<Drink> => {
    const response = await fetch(cocktailUrl + id);
    const { drinks } = (await response.json()) as FullDrinkResponse;
    const [drink] = drinks ?? [];
    if (!drink) {
        throw new Error(`No drink found for id ${id}`);
    }
    return processDrink(drink);
};

export const fetchDrinkById = async (id: string) => {
    const cachedDrink = rumDrinksCache?.find((drink) => drink.id === id);
    if (cachedDrink) {
        return cachedDrink;
    }
    return await fetchDrinkDetails(id);
};

export const fetchRumDrinks = async () => {
    if (rumDrinksCache) {
        return rumDrinksCache;
    }
    const response = await fetch(rumUrl);
    const { drinks } = (await response.json()) as DrinkResponse;
    const summaries = drinks ?? [];
    rumDrinksCache = await Promise.all(
        summaries.map(async ({ idDrink }) => await fetchDrinkDetails(idDrink))
    );
    return rumDrinksCache;
};
