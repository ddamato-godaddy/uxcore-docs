import React, { useCallback, useMemo, useState } from 'react';
import Minisearch from 'minisearch';
import excerpt from 'excerpt';
import styles from './styles.module.scss';

function flatten(reference) {
  reference.map((ref) => {
    Object.keys(ref.data).forEach((key) => {
      ref[`data-${key}`] = ref.data[key];
    });
  });
  return reference;
}

function limit(result) {
  const [firstTermInbody] = Object.entries(result.match)
    .map(([term, fields]) => fields.includes('body') && term)
    .filter(Boolean);
  if (!firstTermInbody) return [];
  const [before, ...rest] = excerpt(result.body, firstTermInbody, 20).split(
    firstTermInbody
  );
  return [before, firstTermInbody, rest.join(firstTermInbody)];
}

export default function SiteSearch({ reference }) {
  const [results, setResults] = useState([]);

  const resource = useMemo(() => {
    const miniSearch = new Minisearch({
      fields: ['collection', 'data-title', 'body'],
      storeFields: ['path', 'data-title', 'body'],
    });
    const flattened = flatten(reference);
    miniSearch.addAll(flattened);
    return miniSearch;
  }, reference);

  const onChange = useCallback(function ({ target }) {
    if (target.value.length < 2) return setResults([]);
    setResults(resource.search(target.value));
  }, []);

  return (
    <div className={ styles.root }>
      <input type='search' onChange={onChange} className={ styles.input } placeholder='Site search' />
      <Results results={results} />
    </div>
  );
}

function Results({ results }) {
  if (!results?.length) return null;
  const label = results.length > 1 ? 'results' : 'result';
  return (
    <div className={ styles.results }>
      <span>{ results.length } { label }</span>
      <ul>
        {results.map((result) => (
          <Result key={result.id} data={result} />
        ))}
      </ul>
    </div>
  );
}

function Result({ data }) {
  const body = limit(data);

  function format(parts) {
    if (!parts?.length) return null;
    const [before, term, rest] = parts;
    return (
      <p>
        {before}
        <strong>{term}</strong>
        {rest}
      </p>
    );
  }

  return (
    <li>
      <h2>
        <a href={data.path}>{data['data-title']}</a>
      </h2>
      {format(body)}
    </li>
  );
}
