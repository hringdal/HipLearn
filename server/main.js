import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Courses } from '../imports/api/courses.js';

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
  addCourseStudent(doc) {
    console.log(doc);
    check(doc, Object);
    const id = doc._id;

    this.unblock();

    Meteor.users.update({ _id: Meteor.userId() }, { $addToSet: { courses: id } });
  },
  isSubjectUnique(subjectName) {
    check(subjectName, String);
    return Courses.find({
      name: subjectName.toUpperCase(),
    }).count() === 0;
  },
});
