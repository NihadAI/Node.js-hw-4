import FileDB from "../FileDB";

const newspostSchema = {
  id: Number,
  title: String,
  text: String,
  createDate: Date,
};

const fileDb = new FileDB()
fileDb.registerSchema()

const newspostTable = FileDB.getTable('newspost');



export default newspostTable;