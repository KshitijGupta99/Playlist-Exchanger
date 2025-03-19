"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5000;
app.get("/", (req, res) => {
    res.send("SErver is running...");
});
app.use((0, cors_1.default)({
    origin: "*", // Change this to your frontend domain for security
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// const v1routes = require('./src/routes/index');
const routes_1 = __importDefault(require("./src/routes"));
app.use("/v1", routes_1.default);
// app.use((req, res, next) => {
//   return InternalServerErrorResponse.send(
//     res,
//     'Route not found or does not exist!',
//   );
// });
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
