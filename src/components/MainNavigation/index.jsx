import React from 'react';
import styles from './styles.module.scss';

function Section({ section, entries }) {
  const navigation = Object.entries(entries);
  if (!navigation.length) return null;

  return (
    <li>
      <span>{section}</span>
      <ul className={ styles.list }>
        {navigation.map(([name, url]) => (
          <Item name={name} url={url} key={name} />
        ))}
      </ul>
    </li>
  );
}

function Item({ name, url }) {
  return (
    <li>
      <a href={url}>{name}</a>
    </li>
  );
}

export default function MainNavigation({ tree }) {
  const navigation = Object.entries(tree);
  if (!navigation.length) return null;

  return (
    <nav className={ styles.nav }>
      <ul>
        {navigation.map(([section, entries]) => (
          <Section section={section} entries={entries} key={section} />
        ))}
      </ul>
    </nav>
  );
}
