import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { EasySearch } from 'meteor/matteodem:easy-search';

export const Courses = new Mongo.Collection('courses');

const CourseSchema = new SimpleSchema({
  owner_id: {
    type: String,
    label: 'Created by',
    autoValue() {
      return Meteor.userId();
    },
  },
  name: {
    type: String,
    label: 'Course Name',
    autoform: {
      afFieldInput: {
        options() {
          return Courses.find({}, { name: 1, sort: { name: 1 } }).map(function createSet(c) {
            return { label: c.name.toUpperCase(), value: c._id };
          });
        },
      },
    },
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
    optional: true,
  },
  'books.$.': String,
  faculty: {
    type: String,
    optional: true,
    label: 'Course faculty',
  },
}, { tracker: Tracker });

Courses.attachSchema(CourseSchema);

export const PlayersIndex = new EasySearch.Index({
  collection: Courses,
  fields: ['name'],
  engine: new EasySearch.MongoDB(),
});
