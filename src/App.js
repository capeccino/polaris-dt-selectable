import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import {AppProvider, Card, DataTable} from '@shopify/polaris';
import ColSelector from './ColSelector';

function App() {
  const [results, setResults] = useState(null);
  const [usedResults, setUsedResults] = useState(null);
  const [cols, setCols] = useState(14);

  const headerFlags = {
    "CONTENT TYPE": 1 << 1,
    "TITLE": 1 << 2,
    "ABBR": 1 << 3,
    "ISSN": 1 << 4,
    "e-ISSN": 1 << 5,
    "PUBLICATION RANGE: START": 1 << 6,
    "PUBLICATION RANGE: LATEST PUBLISHED": 1 << 7,
    "SHORTCUT URL": 1 << 8,
    "ARCHIVE URL": 1 << 9
  }

  const determineShownResults = (colFlags) => {
    if(!results) return;
    if(!colFlags) colFlags = cols;

    const tempResults = [];
    const headerArray = Object.keys(headerFlags);
    const keepers = [];
    
    headerArray.forEach((key, idx) => {
      if((colFlags & headerFlags[key]) !== 0) keepers.push(idx);
    });

    results.data.forEach(result => {
      tempResults.push(keepers.map(idx => result[idx]));
    });

    setUsedResults(tempResults);
  }

  const setColsExt = (colFlags) => {
    setCols(colFlags);
    determineShownResults(colFlags);
  };

  useEffect(() => {
    async function getData() {
      const response = await fetch('./normal.csv');
      const reader = response.body.getReader();
      const result = await reader.read(); // raw array
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value); // the csv text
      const results = Papa.parse(csv); // object with { data, errors, meta }
      setResults(results);
    }
    getData()
  }, []);

  //should only happen twice since results is the original parsed data that never changes after assigned.
  useEffect(() => {
    if(results) determineShownResults(cols);
  }, [results]);

  return (
  <AppProvider>
    {usedResults &&
    <Card>
      <ColSelector headerFlags={headerFlags} currentCols={cols} setCols={setColsExt} />
      <DataTable 
      columnContentTypes={usedResults[0].map(x => 'text')}
      headings={usedResults[0]}
      rows={usedResults.slice(1)}
      />
    </Card>}
  </AppProvider>
  );
}

export default App;
