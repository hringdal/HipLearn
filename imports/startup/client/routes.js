import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Routes
FlowRouter.route('/', {
  name: 'root',
  action() {
    BlazeLayout.render('minimalLayout', { main: 'frontpage' });
  },
});

FlowRouter.route('/books', {
  name: 'books.index',
  action() {
    BlazeLayout.render('mainLayout', { main: 'listBooks' });
  },
});

FlowRouter.route('/books/:_id/edit', {
  name: 'books.edit',
  action() {
    BlazeLayout.render('mainLayout', { main: 'editBook' });
  },
});

FlowRouter.route('/books/new', {
  name: 'books.new',
  action() {
    BlazeLayout.render('mainLayout', { main: 'newBook' });
  },
});

FlowRouter.route('/books/show', {
  name: 'books.show',
  action() {
    BlazeLayout.render('mainLayout', { main: 'showBook' });
  },
});

FlowRouter.route('/student', {
  name: 'student.show',
  action() {
    BlazeLayout.render('mainLayout', { main: 'studentPage' });
  },
});

FlowRouter.route('/teacher', {
  name: 'teacher.show',
  action() {
    BlazeLayout.render('mainLayout', { main: 'studentPage' });
  },
});

// Redirect for all unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('mainLayout', { main: 'appNotFound' });
  },
};
