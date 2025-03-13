import express, { Application, Express, Request, Response } from "express";
const app:Application = express()
const port:Number = 3000;

app.get('/', (req, res) => {
  res.send('SErver is running...')
})

const v1routes = require('./src/routes/index');
app.use('/v1', v1routes);

// app.use((req, res, next) => {
//   return InternalServerErrorResponse.send(
//     res,
//     'Route not found or does not exist!',
//   );
// });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})