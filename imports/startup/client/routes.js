import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Routes
FlowRouter.route('/', {
  name: 'root',
  action() {
    BlazeLayout.render('minimalLayout', { main: 'frontpage' });
  },
});

FlowRouter.route('/books/:_id/edit', {
  name: 'books.edit',
  action() {
    BlazeLayout.render('mainLayout', { main: 'editBook', sidebar: 'teacherSidebar' });
  },
  triggersEnter: [() => {
    window.scrollTo(0, 0);
  }],
});

FlowRouter.route('/books/new/:courseId', {
  name: 'books.new',
  action() {
    BlazeLayout.render('mainLayout', { main: 'newBook', sidebar: 'teacherSidebar' });
  },
});

FlowRouter.route('/books/new/isbn/:courseId', {
  name: 'books.new.isbn',
  action() {
    BlazeLayout.render('mainLayout', { main: 'newBookISBN', sidebar: 'teacherSidebar' });
  },
});

FlowRouter.route('/student', {
  name: 'student.show',
  action() {
    BlazeLayout.render('mainLayout', { main: 'studentPage', sidebar: 'studentSidebar' });
  },
});

FlowRouter.route('/student/course/:courseId', {
  name: 'student.course',
  action() {
    BlazeLayout.render('mainLayout', { main: 'studentPage', sidebar: 'studentSidebar' });
  },
});

FlowRouter.route('/teacher', {
  name: 'teacher.show',
  action() {
    BlazeLayout.render('mainLayout', { main: 'teacherPage', sidebar: 'teacherSidebar' });
  },
});

FlowRouter.route('/teacher/course/:courseId', {
  name: 'teacher.course',
  action() {
    BlazeLayout.render('mainLayout', { main: 'teacherPage', sidebar: 'teacherSidebar' });
  },
});

FlowRouter.route('/teacher/course/:courseId/edit', {
  name: 'teacher.edit',
  action() {
    BlazeLayout.render('mainLayout', { main: 'editCourse', sidebar: 'teacherSidebar' });
  },
});

FlowRouter.route('/teacher/new/', {
  name: 'teacher.new',
  action() {
    BlazeLayout.render('mainLayout', { main: 'createCourse', sidebar: 'teacherSidebar' });
  },
});

FlowRouter.route('/list', {
  name: 'list.show',
  action() {
    BlazeLayout.render('mainLayout', { main: 'list' });
  },
});

// Redirect for all unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('mainLayout', { main: 'appNotFound' });
  },
};
