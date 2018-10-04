import React from 'react';
import Title from './Components/Title';
import Tickers from './Containers/Tickers';
import './App.css';

const App = () => (
  <div className="App">
    <Title
      size="h1"
      text="Cryptocurrency App" />
    <Tickers />
  </div>
);

export default App;