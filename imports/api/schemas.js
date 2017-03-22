import { Tracker } from 'meteor/tracker';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

export const Schemas = {};

Schemas.Book = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  course_id: {
    type: String, label: 'Course ID',
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
      placeholder: 'Name',
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

Schemas.UserProfile = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
});

Schemas.User = new SimpleSchema({
  username: {
    type: String,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      return this.unset();
    },
  },
  profile: {
    type: Schemas.UserProfile,
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