import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import type { InferEntrySchema } from 'astro:content';

// z -> zod schema <https://zod.dev/>, incluido en Astro

const books = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
    schema: z.object({
        title: z.string(),
        author: z.string(),
        img: z.string(),
        readtime: z.number(),
        description: z.string(),
        buy: z.object({
            spain: z.string().url(),
            usa: z.string().url(),
        }),
    }),
});

export type Book = InferEntrySchema<'books'>;
export const collections = { books };

/* 

Hasta Astro 6, cuando no se usa loader,
el tipo devuelto por getCollection será

books: {
    id: string;
    render(): Render[".md"];
    slug: string;
    body: string;
    collection: "books";
    data: InferEntrySchema<"books">;
    rendered?: RenderedContent;
    filePath?: string;
}[]

Cuando se usa loader, 
sin indicar type
el tipo devuelto por getCollection será


const books: {
    id: string;
    body?: string;
    collection: "books";
    data: InferEntrySchema<"books">;
    rendered?: RenderedContent;
    filePath?: string;
}[]

Al indicar type="content", el tipo devuelto por getCollection incluirá slug

*/
