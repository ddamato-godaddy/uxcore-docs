import React, { useState, useEffect } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
// import scope from './scope';

import styles from './styles.module.scss';
import './prism.scss';

export default function ReactLive({ code }) {
  return (
    <div className={ styles.root }>
      <LiveProvider code={ code } theme={ { styles: [] } } >
        <LivePreview className={ styles.preview } />
        <LiveError />
        <LiveEditor className={ styles.editor }  />
      </LiveProvider>
    </div>
  );
}
