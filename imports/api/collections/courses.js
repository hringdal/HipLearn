import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Courses = new Mongo.Collection('courses');
export default Courses;

Courses.schema = new SimpleSchema({
  _id: {
    type: String,
  },
  owner_id: {
    type: String,
  },
  students: {
    type: Array,
  },
  books: {
    type: Array,
  },
  faculty: {
    type: String,
  },
});

// For automatic validation with Collection 2
Courses.attachSchema(Courses.schema);
