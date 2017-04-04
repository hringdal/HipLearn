import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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
