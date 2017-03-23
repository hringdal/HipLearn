import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';

// Imports all client templates
import '../imports/startup/client/';
import '../imports/startup/both/';

import '../imports/ui/layouts';
import '../imports/ui/pages';

Meteor.startup(() => {
  AutoForm.setDefaultTemplate('semanticUI');
});
