import { Meteor } from 'meteor/meteor';

import '../imports/startup/server';
import '../imports/startup/both/';
import '../imports/api/';

// Needed because meteor only publishes emails and password
Meteor.publish('userData', function publishUser() {
  if (!this.userId) return null;
  return Meteor.users.find(this.userId, { fields: {
    role: 1,
    courses: 1,
  } });
});
