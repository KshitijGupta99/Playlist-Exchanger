import express, { Application, Express, Request, Response } from "express";
import cors from "cors";
const app: Application = express();
const port: Number = 5000;

app.get("/", (req, res) => {
  res.send("SErver is running...");
});

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  }),
);

// const v1routes = require('./src/routes/index');
import v1Routes from "./src/routes";
app.use("/v1", v1Routes);

// app.use((req, res, next) => {
//   return InternalServerErrorResponse.send(
//     res,
//     'Route not found or does not exist!',
//   );
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
