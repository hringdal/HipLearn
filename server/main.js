import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Courses } from '../imports/api/courses.js';
import { Following } from '../imports/api/following.js';

import '../imports/startup/both/';
import '../imports/api/';

// Needed because meteor only publishes emails and password
Meteor.publish('userData', function () {
  if (!this.userId) return null;
  return Meteor.users.find(this.userId, { fields: {
    role: 1,
    courses: 1,
  } });
});

Meteor.methods({
  // connected to the 'addForm'
  addCourseStudent(doc) {
    check(doc, Object);
    const courseId = doc._id;
    const userId = Meteor.userId();
    this.unblock();
    Following.upsert({ user_id: userId, course_id: courseId }, { $set: { course_id: courseId } });
  },
  isSubjectUnique(subjectName) {
    check(subjectName, String);
    return Courses.find({
      name: subjectName.toUpperCase(),
    }).count() === 0;
  },
});
