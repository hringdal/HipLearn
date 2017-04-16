import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';

const FollowingSchema = new SimpleSchema({
  user_id: {
    type: String,
  },
  course_id: {
    type: String,
  },
});

export const Following = new Mongo.Collection('following');
Following.attachSchema(FollowingSchema);

Meteor.methods({
  'following.unfollow': function unfollowCourse(courseId) {
    check(courseId, String);
    Following.remove({
      user_id: this.userId,
      course_id: courseId,
    });
  },
});
