import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { SearchState } from '@devexpress/dx-react-grid';
import {
  Grid,
  Toolbar,
  SearchPanel,
  VirtualTable,
  TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

import { Loading } from '../../../theme-sources/material-ui/components/loading';

const URL = 'https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi/Orders';

export default () => {
  const [columns] = useState([
    { name: 'ShipCountry', title: 'Country' },
    { name: 'ShipCity', title: 'City' },
    { name: 'ShipAddress', title: 'Address' },
  ]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [lastQuery, setLastQuery] = useState();

  const getQueryString = () => {
    let filter = columns.reduce((acc, { name }) => {
      acc.push(`["${name}", "contains", "${encodeURIComponent(searchValue)}"]`);
      return acc;
    }, []).join(',"or",');

    if (columns.length > 1) {
      filter = `[${filter}]`;
    }

    return `${URL}?filter=${filter}`;
  };

  const loadData = () => {
    const queryString = getQueryString();
    if (queryString !== lastQuery && !loading) {
      setLoading(true);
      fetch(queryString)
        .then(response => response.json())
        .then((orders) => {
          setRows(orders.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
      setLastQuery(queryString);
    }
  };

  useEffect(() => loadData());

  return (
    <Paper style={{ position: 'relative' }}>
      <Grid
        rows={rows}
        columns={columns}
      >
        <SearchState
          onValueChange={setSearchValue}
        />
        <VirtualTable />
        <TableHeaderRow />
        <Toolbar />
        <SearchPanel />
      </Grid>
      {loading && <Loading />}
    </Paper>
  );
};
