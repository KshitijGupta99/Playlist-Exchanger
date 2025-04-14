import express, { Application, Express, Request, Response } from "express";
import cors from "cors";
const app: Application = express();
const port: Number = 5000;
import helmet from "helmet";

app.use(cors());

app.get("/", (req, res) => {
  res.send("SErver is running...");
});

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://*.spotify.com",
          "https://*.google-analytics.com",
          "https://*.ingest.sentry.io/",
          "https://*.googletagmanager.com",
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://www.recaptcha.net",
        ],
      },
    },
  })
);


app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "connect-src 'self' https://*.spotify.com https://*.google-analytics.com https://*.ingest.sentry.io/ https://*.googletagmanager.com https://www.google.com/recaptcha/enterprise/;"
  );
  next();
});





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
