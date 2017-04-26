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

// Deny client-side updates because we use methods for handling data
Following.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.methods({
  'following.unfollow': function unfollowCourse(courseId) {
    check(courseId, String);

    if (!Following.findOne({ user_id: this.userId, course_id: courseId })) {
      throw new Meteor.Error('following.unfollow.undefinedError',
        "cannot unfollow a course you don't follow");
    }

    Following.remove({
      user_id: this.userId,
      course_id: courseId,
    });
  },
  // connected to the 'followCourse' form
  'following.follow': function followCourse(doc) {
    check(doc, {
      _id: String,
    });
    const courseId = doc._id;
    const userId = this.userId;
    Following.update({ user_id: userId, course_id: courseId },
      {
        $set: {
          course_id: courseId,
        },
        $setOnInsert: {
          user_id: userId,
        },
      },
      { upsert: true },
    );
  },
});
