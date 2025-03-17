"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send('SErver is running...');
});
const v1routes = require('./src/routes/index');
app.use('/v1', v1routes);
// app.use((req, res, next) => {
//   return InternalServerErrorResponse.send(
//     res,
//     'Route not found or does not exist!',
//   );
// });
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
