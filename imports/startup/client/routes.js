import {FlowRouter} from 'meteor/kadira:flow-router';
import {BlazeLayout} from 'meteor/kadira:blaze-layout';

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

FlowRouter.route('/form/', {
  name: 'Form.show',
  action() {
    BlazeLayout.render('App_body', { main: 'Form' });
  },
});

FlowRouter.route('/form/:_id', {
  name: 'Form.Update',
  action() {
    BlazeLayout.render('App_body', { main: 'Form' });
  },
});

FlowRouter.route('/StudentPage', {
    name: 'StudentPage.show',
    action() {
        BlazeLayout.render('App_body', { main: 'StudentPage' });
    },
});

FlowRouter.route('/TeacherPage', {
    name: 'TeacherPage.show',
    action() {
        BlazeLayout.render('App_body', { main: 'StudentPage' });
    },
});

// Redirect for all unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_not_found' });
  },
};
