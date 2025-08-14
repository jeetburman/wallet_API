import express from 'express';
import main from './routes/main.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/v1',main);


app.listen(PORT,console.log(`Server running in http://localhost:${PORT}/api/v1/`));