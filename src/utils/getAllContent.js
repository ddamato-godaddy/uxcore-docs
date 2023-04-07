import { getCollection } from 'astro:content';
import { sections } from '@content/config';

export default async function getAllContent(transform = (f) => f) {
  const collections = await Promise.all(
    sections.map(async function collect(section) {
      const collections = await getCollection(section);
      const promises = collections.map((collection) => ({ ...collection, section })).map(transform);
      return Promise.all(promises);
    })
  );

  return collections.flat();
}
