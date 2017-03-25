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
  role: {
    type: Number,
    allowedValues: [
      1,
      2,
      3,
    ],
    defaultValue: 2,
  },
});

Meteor.users.attachSchema(UserSchema);
