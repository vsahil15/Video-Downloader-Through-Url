import express from 'express';
import fetchurlRouter from './routes/fetchurl.routes.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "successfully server started"
    });
});
app.use('/fetch_url', fetchurlRouter);

export default app;


