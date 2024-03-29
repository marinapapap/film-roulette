"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
(0, dotenv_1.config)({ path: "./config.env" });
const app = (0, express_1.default)();
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use((0, cors_1.default)({ credentials: true, origin: process.env.FRONT_END_URL }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.set("trust proxy", true);
const randomFilm_1 = __importDefault(require("./routes/randomFilm"));
const users_1 = __importDefault(require("./routes/users"));
const tokens_1 = __importDefault(require("./routes/tokens"));
const savedFilms_1 = __importDefault(require("./routes/savedFilms"));
// routes
// app.use("/randomFilm", apiLimiter, randomFilmRouter);
app.use("/randomFilm", randomFilm_1.default);
app.use("/users", users_1.default);
app.use("/tokens", tokens_1.default);
app.use("/savedFilms", savedFilms_1.default);
exports.default = app;
