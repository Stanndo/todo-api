const mongodb = require("mongodb");
const db = require("../data/database");

class Todo {
  constructor(text, category, createdDate, id) {
    this.text = text;
    this.category = category;
    this.createdDate = createdDate;
    this.id = id;
  }

  // display todos
  static async getAllTodos() {
    const todoDocuments = await db.getDb().collection("todos").find().toArray();

    return todoDocuments.map(function (todoDocument) {
      return new Todo(todoDocument.text, todoDocument.category, todoDocument.createdDate, todoDocument._id);
    });
  }

  // create or update todos
  save() {
    const todoId = new mongodb.ObjectId(this.id);
    // Updating
    if (this.id) {
      return db
        .getDb()
        .collection("todos")
        .updateOne(
          { _id: todoId },
          {
            $set: {
              text: this.text,
              category: this.category,
              createdDate: this.createdDate,
            },
          }
        );
    } else {
    // Creating  
      return db.getDb().collection("todos").insertOne({
        text: this.text,
        category: this.category,
        createdDate: this.createdDate,
      });
    }
  }

  // delete todo
  delete() {
    if (!this.id) {
      throw new error("Trying to delete todo without id!");
    }

    const todoId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("todos").deleteOne({ _id: todoId });
  }
}

module.exports = Todo;
