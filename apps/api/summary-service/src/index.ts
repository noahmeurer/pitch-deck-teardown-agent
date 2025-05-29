import express from 'express';
import cors from 'cors';
import config from './config';
import router from './routes';
import notFound from './middleware/not-found';
import errorHandler from './middleware/error-handler';
import requestLogger from './middleware/request-logger';

const app = express();
app.use(requestLogger);     // Middleware to log incoming requests
app.use(cors());            // Enable CORS for all routes
app.use(express.json());    // Parse JSON bodies
app.use('/api', router);    // Mount the router
app.use(notFound);          // Middleware to handle 404 errors
app.use(errorHandler);      // Middleware to handle errors

app.listen(config.port, () => {
    console.log(`Summary service is running on port ${config.port}`);
});