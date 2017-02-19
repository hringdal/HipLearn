import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Client templates
import '../../ui/layouts/app-body.js';
import '../../ui/pages/list.js';
import '../../ui/pages/placeholder.js';
import '../../ui/pages/app-not-found.js';

// Routes
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'Placeholder' });
  },
});

FlowRouter.route('/list', {
  name: 'List.show',
  action() {
    BlazeLayout.render('App_body', { main: 'List' });
  },
});

// Redirect for all unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_not_found' });
  },
};
