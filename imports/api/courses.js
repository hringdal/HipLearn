import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';

const CourseSchema = new SimpleSchema({
  owner_id: {
    type: String,
    label: 'Created by',
  },
  students: {
    type: Array,
    label: 'Students taking the course',
    optional: true,
  },
  'students.$': String,
  books: {
    type: Array,
    label: 'Course books',
  },
  'books.$.': String,
  faculty: {
    type: String,
    optional: true,
    label: 'Course faculty',
  },
}, { tracker: Tracker });

export const Courses = new Mongo.Collection('courses');
Courses.attachSchema(CourseSchema);
