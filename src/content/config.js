import path from 'path';
import { z, defineCollection } from 'astro:content';
const glob = import.meta.glob('./**');

export const collectionNames = Object.keys(glob).map((filepath) => path.basename(path.dirname(filepath)));

/**
 * Defines the frontmatter expected for all md(x) files
 */
const schema = {
  schema: z.object({
    title: z.string(),
  }),
};

export const collections = collectionNames.reduce(
  (acc, name) => Object.assign(acc, { [name]: defineCollection({ ...schema }) }),
  {}
);
