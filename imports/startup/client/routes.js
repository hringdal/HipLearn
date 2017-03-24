import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Routes
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'listBooks' });
  },
});

FlowRouter.route('/list', {
  name: 'List.show',
  action() {
    BlazeLayout.render('App_body', { main: 'List' });
  },
});

FlowRouter.route('/books', {
  name: 'books.index',
  action() {
    BlazeLayout.render('App_body', { main: 'listBooks' });
  },
});

FlowRouter.route('/books/:_id/edit', {
  name: 'books.edit',
  action() {
    BlazeLayout.render('App_body', { main: 'editBook' });
  },
});

FlowRouter.route('/books/new', {
  name: 'books.new',
  action() {
    BlazeLayout.render('App_body', { main: 'newBook' });
  },
});

FlowRouter.route('/books/show', {
  name: 'books.show',
  action() {
    BlazeLayout.render('App_body', { main: 'showBook' });
  },
});

FlowRouter.route('/student', {
  name: 'student.show',
  action() {
    BlazeLayout.render('App_body', { main: 'student' });
  },
});

FlowRouter.route('/teacher', {
  name: 'teacher.show',
  action() {
    BlazeLayout.render('App_body', { main: 'student' });
  },
});

// Redirect for all unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_not_found' });
  },
};
