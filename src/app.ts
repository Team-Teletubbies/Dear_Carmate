import express from 'express';
import carRoutder from './routers/carRouter';

const app: express.Application = express();
app.use(express.json());

app.use('/cars', carRoutder);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
