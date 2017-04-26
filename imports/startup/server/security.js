import { Meteor } from 'meteor/meteor';

// Don't allow users to update their role in the 'profile' field, or add custom data
Meteor.users.deny({
  update() { return true; },
});
