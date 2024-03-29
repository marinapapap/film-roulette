"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RandomFilmController = void 0;
const helperFunctions_1 = require("../helperFunctions");
exports.RandomFilmController = {
    SaveFilm: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Authentication required" });
            }
            const userId = (0, helperFunctions_1.getUserIdFromToken)(token);
            const { film } = req.body;
            if (!film || !film.id || !film.title) {
                return res.status(400).json({ message: "Invalid film data" });
            }
            const user = yield (0, helperFunctions_1.findUserById)(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const filmData = Object.assign({}, film);
            if (user.films.length === 10) {
                return res.status(403).json({
                    error: "Limit Reached",
                    message: "You have reached the limit for saved films",
                });
            }
            user.films.push(filmData);
            yield user.save();
            return res.status(201).json({ user, message: "OK" });
        }
        catch (error) {
            console.error("Error saving film:", error);
            return res.status(500).json({ message: "Failed to save film" });
        }
    }),
    GetFilms: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Authentication required" });
            }
            const userId = (0, helperFunctions_1.getUserIdFromToken)(token);
            const user = yield (0, helperFunctions_1.findUserById)(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(201).json({ films: user.films, message: "OK" });
        }
        catch (error) {
            console.error("Error getting films:", error);
            return res
                .status(500)
                .json({ message: "Failed to get users saved films" });
        }
    }),
    RemoveFilm: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ message: "Authentication required" });
            }
            const userId = (0, helperFunctions_1.getUserIdFromToken)(token);
            const filmIndex = req.body.filmIndex;
            if (typeof filmIndex !== "number") {
                return res.status(400).json({ message: "Invalid film index" });
            }
            const user = yield (0, helperFunctions_1.findUserById)(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (filmIndex >= 0 && filmIndex < user.films.length) {
                user.films.splice(filmIndex, 1);
                yield user.save();
                return res
                    .status(200)
                    .json({ user, message: "Film deleted successfully" });
            }
            else {
                return res.status(404).json({ message: "Invalid film index" });
            }
        }
        catch (error) {
            console.error("Error saving film:", error);
            return res.status(500).json({ message: "Failed to save film" });
        }
    }),
};
