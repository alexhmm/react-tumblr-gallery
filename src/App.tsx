import React from 'react';
import './App.scss';

function App() {
  let url =
    process.env.REACT_APP_API_URL +
    '/posts?api_key=' +
    process.env.REACT_APP_API_KEY;

  fetch(url)
    .then(response => response.json())
    .then(data => console.log(data));

  return (
    <div className='App'>
      <header className='App-header'>
        <p>{process.env.REACT_APP_API_URL}</p>
      </header>
    </div>
  );
}

export default App;
