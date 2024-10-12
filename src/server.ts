import express from 'express';
import {buyItem, getItems} from './routes';

const app = express();
app.use(express.json());

app.use('/api', getItems);
app.use('/api', buyItem);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
