import express from 'express';
import fetchurlRouter from './routes/fetchurl.routes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [ 'http://localhost:5173' ],
    credentials: true,
}));

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "successfully server started"
    });
});
app.use('/api/v1/youtube', fetchurlRouter);

export default app;


