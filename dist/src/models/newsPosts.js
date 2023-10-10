"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FileDB_1 = __importDefault(require("../FileDB"));
const newspostSchema = {
    id: Number,
    title: String,
    text: String,
    createDate: Date,
};
FileDB_1.default.registerSchema('newspost', newspostSchema);
const newspostTable = FileDB_1.default.getTable('newspost');
exports.default = newspostTable;
