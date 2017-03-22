import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';

import SimpleSchema from 'simpl-schema';

import { Courses } from './collections.js';

SimpleSchema.extendOptions(['autoform']);

export const Schemas = {};

Schemas.Book = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  course_id: {
    type: String,
    label: 'Course ID',
    autoform: {
      afFieldInput: {
        options() {
          return Courses.find({}, { _id: 1, sort: { _id: 1 } }).map(function (c) {
            return { label: c._id.toUpperCase(), value: c._id };
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
      return Random.id();
    },
    autoform: {
      type: 'hidden',
    },
  },
  'chapters.$.name': {
    type: String,
    autoform: {
      placeholder: 'Name',
      label: false,
    },
  },
  'chapters.$.subchapters': {
    type: Array,
    optional: true,
    label: 'Subchapters',
    autoform: {
      initialCount: 0,
      label: false,
    },
  },
  'chapters.$.subchapters.$': {
    type: Object,
  },
  'chapters.$.subchapters.$._id': {
    type: String,
    optional: true,
    autoValue() {
      return Random.id();
    },
    autoform: {
      type: 'hidden',
    },
  },
  'chapters.$.subchapters.$.name': {
    type: String,
    autoform: {
      placeholder: 'subchapter',
      label: false,
    },
  },
}, { tracker: Tracker });


Schemas.Course = new SimpleSchema({
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

Schemas.Result = new SimpleSchema({
  user_id: {
    type: String,
    /*    autoValue() {
     return this.userId;
     },*/
  },
  chapter_id: {
    type: String,
  },
  course_id: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
      return this.unset();
    },
  },
}, { tracker: Tracker });

Schemas.User = new SimpleSchema({
  username: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
      return this.unset();
    },
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // Used by alanning:roles
  roles: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});
