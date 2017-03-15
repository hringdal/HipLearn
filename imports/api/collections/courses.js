import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Courses = new Mongo.Collection('Courses');
export default Courses;

Courses.schema = new SimpleSchema({
  // rules go here
});

// For automatic validation with Collection 2
Courses.attachSchema(Courses.schema);
