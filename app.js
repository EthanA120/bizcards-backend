import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';

// import routes from './routes/index.js';
import logger from './middlewares/logger.js';
import connectDB from './services/dbService.js';
import usersRouter from "./routes/usersRouter.js";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Accept, Authorization',
}));

app.use(express.static('public'));
app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Register the user routes
app.use("/users", usersRouter);

// Must be the last middleware
app.use((req,res) => {
  res.status(404).sendFile('404.html', { root: 'public' });
})

app.listen(PORT, () => {
  console.log(chalk.green(`Server is running on port ${PORT}`));
});