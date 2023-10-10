"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FileDB {
    constructor(schemaName) {
        this.schemaName = schemaName;
    }
    async readDatabase() {
        try {
            const data = await fs_1.default.promises.readFile(path_1.default.join(__dirname, 'db.json'), 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            return [];
        }
    }
    async saveToFile(data) {
        try {
            await fs_1.default.promises.writeFile(path_1.default.join(__dirname, 'db.json'), JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (error) {
            console.log(error);
        }
    }
    static async registerSchema(schemaName, schema) {
        this.schemas[schemaName] = schema;
        return schemaName;
    }
    static async getTable(schemaName) {
        const schema = this.schemas[schemaName];
        if (!schema) {
            throw new Error(`Schema: '${schemaName}' is not registered!`);
        }
        return new FileDB(schemaName);
    }
    async getAll() {
        try {
            const database = await this.readDatabase();
            return database;
        }
        catch (error) {
            throw error;
        }
    }
    async getById(item, field) {
        try {
            const database = await this.readDatabase();
            const data = database.find((data) => data[field] === item);
            return data;
        }
        catch (error) {
            throw error;
        }
    }
    async create(newItem) {
        try {
            const database = await this.readDatabase();
            database.push(newItem);
            await this.saveToFile(database);
            return newItem;
        }
        catch (error) {
            throw error;
        }
    }
    async update(id, updatedFields) {
        try {
            const database = await this.readDatabase();
            const index = database.findIndex((item) => item.id === id);
            if (index === -1) {
                throw new Error('Item not found');
            }
            const updatedItem = Object.assign(Object.assign({}, database[index]), updatedFields);
            database[index] = updatedItem;
            await this.saveToFile(database);
            return updatedItem;
        }
        catch (error) {
            throw error;
        }
    }
    async delete(id) {
        try {
            const database = await this.readDatabase();
            const index = database.findIndex((item) => item.id === id);
            if (index === -1) {
                throw new Error('Item not found');
            }
            const deletedItem = database.splice(index, 1)[0];
            await this.saveToFile(database);
            return deletedItem;
        }
        catch (error) {
            throw error;
        }
    }
}
FileDB.schemas = {};
exports.default = FileDB;
