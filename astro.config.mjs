import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { visit } from 'unist-util-visit';
import find from 'unist-util-find';

const ReactLiveImportBody = {
  type: 'ImportDeclaration',
  specifiers: [
    {
      type: 'ImportDefaultSpecifier',
      local: {
        type: 'Identifier',
        name: 'ReactLive',
      },
    },
  ],
  source: {
    type: 'Literal',
    value: '@components/ReactLive',
    raw: "'@components/ReactLive'",
  },
};

const esmImportModel = {
  type: 'mdxjsEsm',
  value: '',
  data: {
    estree: {
      type: 'Program',
      body: [],
      sourceType: 'module',
    },
  },
};

const transformer = (ast) => {
  const insertions = new Set();
  visit(ast, 'code', (node, index, parent) => {
    if (node?.meta !== 'live') return;
    insertions.add(parent);
    parent.children[index] = {
      type: 'mdxJsxFlowElement',
      name: 'ReactLive',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'code',
          value: node.value
        },
        {
          type: 'mdxJsxAttribute',
          name: 'client:load',
          value: null
        }
      ],
      children: [],
      data: { _mdxExplicitJsx: true }
    };
  });

  insertions.forEach((parent) => {
    let esmImport = find(parent, { type: 'mdxjsEsm' });
    if (!esmImport) {
      esmImport = esmImportModel;
      parent.children.unshift(esmImport);
    }
    esmImport.value += `\nimport ReactLive from '@components/ReactLive';`;
    delete esmImport?.position;
    esmImport.data.estree.body.push(ReactLiveImportBody);
  });
};

export default defineConfig({
  integrations: [react(), mdx()],
  site: 'https://ddamato-godaddy.github.io',
  base: '/uxcore-docs',
  markdown: {
    remarkPlugins: [() => transformer],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
  },
});
