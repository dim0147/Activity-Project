import React from 'react';

import { makeStyles } from '@material-ui/styles';

import Header from './Header';
import Dashboard from './Dashboard';
const useStyles = makeStyles((theme) => ({
  root: {
      display: 'flex',
  }
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
     <Dashboard />
    </div>
  );
}

export default App;
