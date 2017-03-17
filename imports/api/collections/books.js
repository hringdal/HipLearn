import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Books = new Mongo.Collection('books');
export default Books;

Books.schema = new SimpleSchema({
  name: {
    type: String,
  },
  course_id: {
    type: String,
  },
  chapters: {
    type: Array,
  },
});

// For automatic validation with Collection 2
Books.attachSchema(Books.schema);
