import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Courses } from '../imports/api/courses.js';
import { Following } from '../imports/api/following.js';

import '../imports/startup/server';
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
  // connected to the 'followCourse' form
  followCourseStudent(doc) {
    check(doc, Object);
    const courseId = doc._id;
    const userId = Meteor.userId();
    this.unblock();
    Following.upsert({ user_id: userId, course_id: courseId }, { $set: { course_id: courseId } });
  },
  isSubjectUnique(subjectCode) {
    check(subjectCode, String);
    return Courses.find({
      code: subjectCode.toUpperCase(),
    }).count() === 0;
  },
});

Meteor.users.deny({
  update() { return true; },
});

// TODO: remove
Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://postmaster@hiplearn.me:428910f8aacf9f60daa3449627573939@smtp.mailgun.org:587';
});
