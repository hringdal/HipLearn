import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions(['autoform']);

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
    unique: true,
    custom() {
      // used for checking whether a new subject <name> is unique
      if (Meteor.isClient && this.isSet) {
        Meteor.call('isSubjectUnique', this.value, (error, result) => {
          if (!result) {
            this.validationContext.addValidationErrors([{
              name: 'username',
              type: 'notUnique',
            }]);
          }
        });
      }
    },
    autoValue() {
      if (this.isInsert && typeof this.value === 'string') {
        return this.value.toUpperCase();
      }
      return this.unset();
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

// #11 - Makes the error for creating new non-unique courses more descriptive
CourseSchema.messageBox.messages({
  en: {
    notUnique: '{{label}} already exists',
  },
});

Courses.attachSchema(CourseSchema);

// add new courses on the student page
export const AddCourseSchema = new SimpleSchema({
  _id: {
    type: String,
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
}, { tracker: Tracker });
