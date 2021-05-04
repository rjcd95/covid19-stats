import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MenuAppBar from './MenuAppBar';
import Statistics from './Statistics';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function Dashboard() {
  const [flterSearch, setFilterSearch] = useState('');

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <MenuAppBar setFilterSearch={ setFilterSearch } />
        <Container maxWidth="lg" className={classes.container}>
          <Statistics filterSearch={ flterSearch } />
        </Container>
      </main>
    </div>
  );
}