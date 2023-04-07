import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

const id = 'uxcore-theme-style';

function headRender({ themeCSS, fontFaces }) {
  const style =
    document.getElementById(id) ||
    document.head.appendChild(
      Object.assign(document.createElement('style'), { id })
    );
  style.textContent = `${fontFaces} ${themeCSS}`;
}

export default function ThemeSwitcher({ themes: fetchedThemes = [] }) {
  const [themes, setThemes] = useState(fetchedThemes);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || '';
  });

  useEffect(() => {
    if (!themes?.length) {
      fetch(
        `https://theme-api.uxp.godaddy.com/v1/themes`
      ).then((response) => response.json())
      .then((data) => setThemes(data.themes));
    }
  }, [themes]);

  useEffect(() => {
    if (!theme) return;
    fetch(
      `https://theme-api.uxp.godaddy.com/v1/generate?alias=${theme}`
    ).then((response) => response.json())
    .then(headRender);
  }, [theme]);

  useEffect(() => {
    theme && localStorage.setItem('theme', theme);
  }, [theme])

  if (!themes?.length) return (
    <strong className={ styles.vpn }>
      Check VPN!
    </strong>
  );

  return (
    <div>
      <select onChange={(ev) => setTheme(ev.target.value)} value={ theme } className={ styles.select }>
        <option disabled value=''>
          Select a theme
        </option>
        {themes.map(({ alias }) => (
          <option key={alias} value={alias}>
            {alias}
          </option>
        ))}
      </select>
    </div>
  );
}
