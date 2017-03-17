import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const Schema = {};

Schema.UserProfile = new SimpleSchema({
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
});

Schema.User = new SimpleSchema({
  username: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  profile: {
    type: Schema.UserProfile,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // Used by alanning:roles
  roles: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

Meteor.users.attachSchema(Schema.User);
