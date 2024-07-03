import express from 'express';
import cors from 'cors';


const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.get('/api/data', (req, res) => {
  res.json('This is data from the backend' );
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
