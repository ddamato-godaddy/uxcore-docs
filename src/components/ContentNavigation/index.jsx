import React, { useEffect, useState } from 'react';
import styles from  './styles.module.scss';

export default function ContentNavigation({ outline }) {
  if (!outline?.length) return null;

  const [firstItem] = outline;
  const [currentSlug, setCurrentSlug] = useState(firstItem.slug);

  useEffect(() => {
    const setCurrent = (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          return setCurrentSlug(target.id);
        }
      });
    };

    const headingsObserver = new IntersectionObserver(setCurrent, {
      threshold: 1,
    });

    // document.querySelectorAll('#content :is(h1,h2,h3)').forEach((h) => headingsObserver.observe(h));

    return () => headingsObserver.disconnect();
  }, []);

  function Item({ heading }) {
    const { depth, slug, text, children } = heading;
    return (
      <li style={{ '--depth': depth }}>
        <a
          className={ styles.link }
          href={`#${slug}`}
          onClick={() => setCurrentSlug(slug)}
          aria-current={ currentSlug === slug }
        >
          {text}
        </a>
        <Items headings={children} />
      </li>
    );
  }

  function Items({ headings, main }) {
    if (!headings?.length) return null;
    const classNames = [styles.list];
    if (main) classNames.push(styles.main);
    return (
      <ul className={ classNames.join(' ') }>
        {headings.map((heading) => (
          <Item key={heading.slug} heading={heading} />
        ))}
      </ul>
    );
  }

  return (
    <nav className={ styles.root }>
      <Items headings={outline} main={ true } />
    </nav>
  );
}
