import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
// Imports all client templates
import '../imports/startup/client/';
import '../imports/startup/both/';

import '../imports/ui/layouts';
import '../imports/ui/pages';

Meteor.startup(() => {
  AutoForm.setDefaultTemplate('semanticUI');
});

BlazeLayout.setRoot('body');

// Needed for viewing role and courses.
// see server/main.js
Meteor.autorun(function autorun() {
  Meteor.subscribe('userData');
});
