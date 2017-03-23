import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import { Courses } from './courses.js';

const BookSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  course_id: {
    type: String,
    label: 'Course ID',
    /*autoform: {
      afFieldInput: {
        options() {
          return Courses.find({}, { _id: 1, sort: { _id: 1 } }).map(function (c) {
            return { label: c._id.toUpperCase(), value: c._id };
          });
        },
      },
    },*/
  },
  chapters: {
    type: Array,
    label: 'Chapters',
    optional: true,
  },
  'chapters.$': {
    type: Object,
    label: 'Chapter',
  },
  'chapters.$._id': {
    type: String,
    optional: true,
    autoValue() {
      return Random.id();
    },
    autoform: {
      type: 'hidden',
    },
  },
  'chapters.$.name': {
    type: String,
    label: 'Title',
    autoform: {
      placeholder: 'Name',
    },
  },
  'chapters.$.level': {
    type: Number,
    optional: true,
  },
}, { tracker: Tracker });

export const Books = new Mongo.Collection('books');
Books.attachSchema(BookSchema);
