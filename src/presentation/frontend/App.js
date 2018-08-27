import React from 'react';
import Router from './router/Router';
import reset from './ui/reset';

function App() {
  reset();
  return <Router />;
}

export default App;
