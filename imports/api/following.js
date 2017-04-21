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

if (Meteor.isServer) {
  Meteor.publish('following', function followingPublication() {
    return Following.find({ user_id: this.userId });
  });
  Meteor.publish('following.count', function followingCountPublication(courseId) {
    check(courseId, String);
    return Following.find({ course_id: courseId });
  });
}

Meteor.methods({
  'following.unfollow': function unfollowCourse(courseId) {
    check(courseId, String);
    Following.remove({
      user_id: this.userId,
      course_id: courseId,
    });
  },
});
