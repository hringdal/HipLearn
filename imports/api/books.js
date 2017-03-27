import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import { Courses } from './courses.js';

const BookSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
  },
  course_id: {
    type: String,
    label: 'Course ID',
    autoform: {
      afFieldInput: {
        options() {
          return Courses.find({}, { _id: 1, sort: { _id: 1 } }).map(function createSet(c) {
            return { label: c.name.toUpperCase(), value: c._id };
          });
        },
      },
    },
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
      // might be a problem
      // deleting books in the array on edit gives an UpdateError
      if (this.isSet) {
        return this.value;
      } else {
        return Random.id();
      }
    },
    autoform: {
      type: 'hidden',
    },
  },
  'chapters.$.name': {
    type: String,
    label: 'Chapter',
    autoform: {
      placeholder: 'Chapter name',
    },
  },
  'chapters.$.level': {
    type: Number,
    allowedValues: [1, 2, 3],
    label: 'Chapter level ( 1 means a main chapter )',
    autoform: {
      type: 'select-radio',
      options: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
      ],
    },
  },
}, { tracker: Tracker });

export const Books = new Mongo.Collection('books');
Books.attachSchema(BookSchema);
