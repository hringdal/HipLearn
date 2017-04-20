import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Notifications = new Mongo.Collection('notifications');

const NotificationSchema = new SimpleSchema({
  user_id: {
    type: String,
    autoValue() {
      return this.userId;
    },
  },
  book_id: {
    type: String,
  },
  course_id: {
    type: String,
  },
  read: {
    type: Boolean,
  },
});

Notifications.attachSchema(NotificationSchema);
