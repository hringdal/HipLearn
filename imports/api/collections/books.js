import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Books = new Mongo.Collection('books');
export default Books;

Books.schema = new SimpleSchema({
  // rules go here
});

// For automatic validation with Collection 2
Books.attachSchema(Books.schema);
