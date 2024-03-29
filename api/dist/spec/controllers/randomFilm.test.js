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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const jest_fetch_mock_1 = __importDefault(require("jest-fetch-mock"));
require("jest-fetch-mock").enableMocks();
describe("RandomFilmController", () => {
    beforeEach(() => {
        jest_fetch_mock_1.default.resetMocks();
    });
    test("'Find' method returns status code 200", () => __awaiter(void 0, void 0, void 0, function* () {
        jest_fetch_mock_1.default.mockResponseOnce(JSON.stringify({
            items: [{ film: "hey film" }],
        }));
        let response = yield (0, supertest_1.default)(server_1.default).get("/randomFilm");
        expect(response.status).toEqual(200);
    }));
    test("'Find' method returns status code 500", () => __awaiter(void 0, void 0, void 0, function* () {
        let response = yield (0, supertest_1.default)(server_1.default).get("/randomFilm");
        expect(response.status).toEqual(500);
    }));
});
