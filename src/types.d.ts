export type Drink = {
    id: string;
    name: string;
    nameAlternate: string | null;
    tags: string[] | null;
    // strVideo: string | null;
    category: string;
    //strIBA: string | null;
    alcoholic: string;
    glass: string;
    instructions: string;
    instructionsES: string;
    drinkThumb: string;
    ingredients: {
        ingredient: string;
        measure: string;
    }[];
    dateModified: Date;
};
