import fs from 'fs';
import path from 'path';

class FileDB {
  public schemaName: string;
  public schemas: Record<string, any> = {};

  constructor() {
    
  }

  public async registerSchema<T>(schemaName: string, schema: T): Promise<string> {
    this.schemas[schemaName] = schema;
    return schemaName;
  }

  public async getTable<T>(schemaName: string): Promise<Table<T>> {
    const schema = this.schemas[schemaName];
    if (!schema) {
      throw new Error(`Schema: '${schemaName}' is not registered!`);
    }
    return new Table<T>(schemaName);
  }
}

class Table<T> {
  private schemaName: string;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
  }

  private async readDatabase(): Promise<T[]> {
    try {
      const data = await fs.promises.readFile(path.join(__dirname, `${this.schemaName}.json`), 'utf-8');
      return JSON.parse(data); 
    } catch (error) {
      return [];
    }
  }

  private async saveToFile(data: T[]): Promise<void> {
    try {
      await fs.promises.writeFile(path.join(__dirname, `${this.schemaName}.json`), JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(): Promise<T[]> {
    try {
      const database = await this.readDatabase();
      return database;
    } catch (error) {
      throw error;
    }
  }

  async getById(item: string, field: string): Promise<T> {
    try {
      const database = await this.readDatabase();
      const data = database.find((data) => (data as any)[field] === item);
      return data as T;
    } catch (error) {
      throw error;
    }
  }

  async create(newItem: T): Promise<T> {
    try {
      const database = await this.readDatabase();
      database.push(newItem);
      await this.saveToFile(database);
      return newItem;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatedFields: Partial<T>): Promise<T> {
    try {
      const database = await this.readDatabase();
      const index = database.findIndex((item) => (item as any).id === id);
      if (index === -1) {
        throw new Error('Item not found');
      }
      const updatedItem = {
        ...database[index],
        ...updatedFields,
      };
      database[index] = updatedItem;
      await this.saveToFile(database);
      return updatedItem as T;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<T> {
    try {
      const database = await this.readDatabase();
      const index = database.findIndex((item) => (item as any).id === id);
      if (index === -1) {
        throw new Error('Item not found');
      }
      const deletedItem = database.splice(index, 1)[0];
      await this.saveToFile(database);
      return deletedItem as T;
    } catch (error) {
      throw error;
    }
  }
}

export default FileDB;
