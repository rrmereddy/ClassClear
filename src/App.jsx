import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/data')
      .then(response => {
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching message:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React App with Backend</h1>
        {message ? <p>{message}</p> : <p>Loading...</p>}
      </header>
    </div>
  );
}

export default App;
