import { remark } from 'remark';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';

export default function mdxNormalize(body) {
  return new Promise((resolve, reject) => {
    remark()
      .use(mdx)
      .use(strip, ['mdxjsEsm', 'mdxJsxFlowElement'])
      .process(body, function (err, file) {
        if (err) reject(err);
        resolve(String(file));
      });
  });
}