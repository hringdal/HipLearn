import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';

import { Books } from './books.js';
import { Courses } from './courses.js';
import { Following } from './following.js';

export const Notifications = new Mongo.Collection('notifications');

const NotificationSchema = new SimpleSchema({
  user_id: {
    type: String,
  },
  bookTitle: {
    type: String,
  },
  courseName: {
    type: String,
  },
  course_id: {
    type: String,
  },
  seen: {
    type: Boolean,
  },
  type: {
    type: String,
  },
}, { tracker: Tracker });

Notifications.attachSchema(NotificationSchema);

if (Meteor.isServer) {
  Meteor.publish('notifications', function notificationsPublication() {
    return Notifications.find({ user_id: this.userId, seen: false });
  });
}

Meteor.methods({
  'notifications.create': function createNotification(bookId, type) {
    check(bookId, String);
    check(type, String);

    // get current book data
    const book = Books.findOne(bookId);

    // find related course
    const course = Courses.findOne(book.course_id);

    // find all the ids of students that are following this course
    const followingUserIds = Following.find({ course_id: book.course_id }).map(function list(doc) {
      return doc.user_id;
    });

    // create a new notification for each student
    for (let i = 0; i < followingUserIds.length; i += 1) {
      const notification = {
        user_id: followingUserIds[i],
        bookTitle: book.title,
        courseName: course.name,
        course_id: book.course_id,
        seen: false,
        type,
      };

      Notifications.insert(notification);
    }
  },
  'notifications.seen': function seenNotification(notificationId) {
    check(notificationId, String);
    Notifications.update({ _id: notificationId }, { $set: { seen: true } });
  },
  'notifications.clear': function clearAllNotifications() {
    Notifications.update({ user_id: this.userId }, { $set: { seen: true } }, { multi: true });
  },
});
