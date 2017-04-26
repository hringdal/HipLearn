import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

const UserSchema = new SimpleSchema({
  username: {
    type: String,
    // For accounts-password, either emails or username is required, but not both.
    // It is OK to make this optional because the accounts-password package does its own validation
    // Third-party login packages may not require either. Adjust this schema as necessary.
    optional: true,
  },
  emails: {
    type: Array,
    // For accounts-password, either emails or username is required, but not both.
    // It is OK to make this optional because the accounts-password package does its own validation
    // Third-party login packages may not require either. Adjust this schema as necessary.
    optional: true,
  },
  'emails.$': {
    type: Object,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  profile: {
    type: Object,
  },
  'profile.role': {
    // 1: student
    // 2: teacher
    // 3: admin
    type: Number,
    allowedValues: [
      1,
      2,
      3,
    ],
    // defaultValue: 2,
  },
  courses: {
    // contains course ids
    // for students: a list of courses you are following
    // for teachers: a list of the courses you have created
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'courses.$': {
    type: String,
  },
});

Meteor.users.attachSchema(UserSchema);

Meteor.publish('users.owner', function courseOwner(userId) {
  check(userId, String);
  return Meteor.users.find(userId, { fields: { 'emails.address': 1 } });
});
