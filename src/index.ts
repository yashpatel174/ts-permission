import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// import userRoute from "./route/userRoute";
// import groupRoute from "./route/groupRoute";
import moduleRoute from "./route/moduleRoute";
// import dataRoute from "./route/dataRoute";

dotenv.config();

const app: Application = express();

//* Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//* Connect to MongoDB
mongoose
  .connect(process.env.DB_CONNECTION as string)
  .then(() => console.log("Connected to MongoDB."));

//* Routes
app.use("/modules", moduleRoute);

//* Listening on port
const port: number = parseInt(process.env.PORT as string) || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
