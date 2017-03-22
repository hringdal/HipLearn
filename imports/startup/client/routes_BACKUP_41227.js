import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
<<<<<<< HEAD

// Layout and all route targets
// Each page imports its own components and other pages that it references
import '../../ui/layouts/app-body.js';
import '../../ui/pages/list.js';
import '../../ui/pages/placeholder.js';
import '../../ui/pages/app-not-found.js';
import '../../ui/pages/tasks.js';
import '../../ui/pages/login_Student.js';

// route to login
FlowRouter.route('/login', {
    name: 'login_Student.show',
    action() {
        BlazeLayout.render('App_body', {main: 'login_Student'})
    }
});
=======
import { Books } from '../../api/collections.js';
>>>>>>> a35b4ffefd903544fe03af57b876d6a410272925
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
FlowRouter.route('/janne', {
    name: 'Tasks.show',
    action() {
        BlazeLayout.render('App_body', { main: 'tasks' });
    },
});

FlowRouter.route('/form', {
  name: 'Form.show',
  action() {
    BlazeLayout.render('App_body', { main: 'Form' });
  },
});

// Redirect for all unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_not_found' });
  },
};
