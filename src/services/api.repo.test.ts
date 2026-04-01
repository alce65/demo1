import type { Drink } from '../types';
import { fetchDrinkById } from './api.repo';

const mockDrinkResponse = {
    idDrink: '11007',
    strDrink: 'Margarita',
};

const mockDrink: Drink = {
    id: '11007',
    name: 'Margarita',
    // nameAlternate: '',
    // tags: [],
    // category: 'Ordinary Drink',
    // alcoholic: 'Alcoholic',
    // glass: 'Cocktail glass',
    // instructions: 'Rub the rim of the glass with the lime slice to make the salt stick to it. Take care to moisten..',
    // instructionsES: 'Frote el borde del vaso con la rodaja de lima para que la sal se pegue a él. Tenga cuidado de humedecer..',
    // drinkThumb: 'https://www.thecocktaildb.com/images/media/drink/5noda61589575158.jpg',
    // ingredients: [
    //     { ingredient: 'Tequila', measure: '1 1/2 oz ' },
    //     { ingredient: 'Triple sec', measure: '1/2 oz ' },
    //     { ingredient: 'Lime juice', measure: '1 oz ' },
    //     { ingredient: 'Salt', measure: null }
    // ],
    // dateModified: new Date('2015-08-18 14:42:59')
} as Drink;

// Mock the fetch function to return a predefined response (using VITEST)

// .mock('node-fetch', () => {
//     return {
//         default: vi.fn()
//     };
// });

describe('api.repo', () => {
    test('fetchDrinkById returns a drink', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            json: async () => ({
                drinks: [mockDrinkResponse],
            }),
        } as unknown as Response);

        const drink = await fetchDrinkById('11007');
        expect(fetch).toHaveBeenCalledWith(
            'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=11007',
        );
        expect(drink.id).toBe(mockDrink.id);
        expect(drink.name).toBe(mockDrink.name);
    });
});
