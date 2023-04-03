"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TempSchema = new mongoose_1.default.Schema({
    message: { type: String },
});
const Temp = mongoose_1.default.model("Temp", TempSchema);
exports.default = Temp;
