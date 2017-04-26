import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';
import cheerio from 'cheerio';

import { Following } from './following.js';
import { Results } from './results.js';
import { Books } from './books.js';

SimpleSchema.extendOptions(['autoform']);

export const Courses = new Mongo.Collection('courses');

const CourseSchema = new SimpleSchema({
  year: {
    type: Number, optional: true,
  },
  courseContent: {
    type: String,
    label: 'Description',
    optional: true,
    autoform: {
      placeholder: 'Optional',
    },
  },
  learningGoal: {
    type: String,
    label: 'Learning Goals',
    optional: true,
    autoform: {
      placeholder: 'Optional',
    },
  },
  owner_id: {
    type: String,
    label: 'Created by',
    // eslint-disable-next-line consistent-return
    autoValue() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return this.userId;
      }
      // returns provided value if not insert
    },
  },
  code: {
    type: String,
    label: 'Course Code',
    unique: true,
    custom() {
      // used for checking whether a new subject <name> is unique
      if (Meteor.isClient && this.isSet) {
        Meteor.call('isSubjectUnique', this.value, (error, result) => {
          if (!result) {
            this.validationContext.addValidationErrors([{
              name: 'code', type: 'notUnique',
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
  name: {
    type: String, label: 'Course Name',
  },
  students: {
    type: Array, label: 'Students taking the course', optional: true,
  },
  'students.$': String,
  books: {
    type: Array, label: 'Course books', optional: true,
  },
  'books.$.': String,
  faculty: {
    type: String, optional: true, label: 'Course faculty',
  },
}, { tracker: Tracker });

// #11 - Makes the error for creating new non-unique courses more descriptive
CourseSchema.messageBox.messages({
  en: {
    notUnique: 'This course has already been taken by a different teacher',
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
          const followingCourseIds = Following.find({
            user_id: Meteor.userId() }).map(function createList(c) {
              return c.course_id;
            },
          );

          return Courses.find({
            _id: { $nin: followingCourseIds },
          }, { name: 1, sort: { name: 1 } }).map(function createSet(c) {
            return { label: c.name.toUpperCase(), value: c._id };
          });
        },
      },
    },
  },
}, { tracker: Tracker });

if (Meteor.isServer) {
  Meteor.publish('courses.student', function allCourses() {
    return Courses.find({});
  });
  Meteor.publish('courses.teacher', function teacherCourses() {
    return Courses.find({ owner_id: this.userId });
  });
}

// Deny client-side updates because we use methods for handling data
Courses.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

Meteor.methods({
  'courses.insert': function insertCourse(course) {
    check(course, Object);

    const role = Meteor.users.findOne(this.userId).profile.role;

    if (role < 2) {
      throw new Meteor.Error('courses.insert.accessDenied', 'You must be a teacher to create new courses');
    }

    const courseId = Courses.insert(course);
    // follow your courses automatically as a teacher
    Following.insert({ user_id: this.userId, course_id: courseId });
    return courseId;
  },
  'courses.update': function updateCourse(data) {
    check(data, {
      _id: String, modifier: Object,
    });

    const ownerId = Courses.findOne(data._id).owner_id;

    if (ownerId !== this.userId) {
      throw new Meteor.Error('courses.update.accessDenied', 'Cannot update a course that is not yours');
    }

    Courses.update(data._id, data.modifier);
  },
  'courses.delete': function deleteCourse(courseId) {
    check(courseId, String);

    const ownerId = Courses.findOne(courseId).owner_id;

    if (ownerId !== this.userId) {
      throw new Meteor.Error('courses.delete.accessDenied', 'Cannot delete a course that is not yours');
    }

    Results.remove({ course_id: courseId });
    Following.remove({ course_id: courseId });
    Books.remove({ course_id: courseId });
    Courses.remove(courseId);
  },
  courseInfo(courseId, year) {
    try {
      check(courseId, String);
      check(year, String);
      if (Meteor.isServer) {
        this.unblock();

        try {
          // encode to allow non-ascii characters
          const url = encodeURI(`https://www.ntnu.no/studier/emner/${courseId}/${year}`);
          // Change to callback style if you want to run on client
          const response = HTTP.call('GET', url, {});
          const reCredits = /Studiepoeng:&nbsp;(\d+\.?\d+)/g;
          const match = reCredits.exec(response.content);
          let credits = '';
          if (match && match.length > 1) {
            credits = match[1];
          }
          const $ = cheerio.load(response.content);

          return {
            name: $('#course-details').find('> h1').text(),
            courseContent: $('.content-course-content').text(),
            learningGoal: $('.content-learning-goal').text(),
            credits,
          };
        } catch (e) {
          // Maybe better to not catch error and let caller handle it?

          // Got a network error, timeout, or HTTP error in the 400 or 500 range.
          // Or JSON parse error
          console.log(e);
          return false;
        }
      }
      return false;
    } catch (err) {
      return false;
    }
  },
  isSubjectUnique(subjectCode) {
    check(subjectCode, String);
    return Courses.find({
      code: subjectCode.toUpperCase(),
    }).count() === 0;
  },
});
