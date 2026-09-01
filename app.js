import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';

import { consoleLogger, fileLogger } from './middlewares/loggerMiddleware.js';
import connectDB from './services/dbService.js';
import usersRouter from "./routes/usersRouter.js";
import cardsRouter from "./routes/cardsRouter.js"
import generateInitialData from './services/initialDataService.js';


dotenv.config();

connectDB();
generateInitialData();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(consoleLogger);
app.use(fileLogger);

app.use(cors({
  origin: true,
  credentials: true,
  methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  allowedHeaders: 'Accept, Authorization, x-auth-token, Content-Type',
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Register the routes
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

// Must be the last middleware
app.use((req, res) => {
  res.status(404).sendFile('404.html', { root: 'public' });
})

app.listen(PORT, () => {
  console.log(chalk.green(`Server is running on port ${PORT}`));
});