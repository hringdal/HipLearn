import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Routes
FlowRouter.route('/', {
  name: 'root',
  action() {
    BlazeLayout.render('minimalLayout', { main: 'frontpage' });
  },
});

FlowRouter.route('/about', {
  name: 'about',
  action() {
    BlazeLayout.render('mainLayout', { main: 'about', sidebar: 'hippo' });
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

// Access is restricted in the template through the adminLayout
const teacherRoutes = FlowRouter.group({
  prefix: '/teacher',
});

teacherRoutes.route('/books/:_id/edit', {
  name: 'books.edit',
  action() {
    BlazeLayout.render('adminLayout', { main: 'editBook', sidebar: 'teacherSidebar' });
  },
  triggersEnter: [() => {
    window.scrollTo(0, 0);
  }],
});

teacherRoutes.route('/books/new/:courseId', {
  name: 'books.new',
  action() {
    BlazeLayout.render('adminLayout', { main: 'newBook', sidebar: 'teacherSidebar' });
  },
});

teacherRoutes.route('/books/new/isbn/:courseId', {
  name: 'books.new.isbn',
  action() {
    BlazeLayout.render('adminLayout', { main: 'newBookISBN', sidebar: 'teacherSidebar' });
  },
});

teacherRoutes.route('/', {
  name: 'teacher.show',
  action() {
    BlazeLayout.render('adminLayout', { main: 'teacherPage', sidebar: 'teacherSidebar' });
  },
});

teacherRoutes.route('/course/:courseId', {
  name: 'teacher.course',
  action() {
    BlazeLayout.render('adminLayout', { main: 'teacherPage', sidebar: 'teacherSidebar' });
  },
});

teacherRoutes.route('/course/:courseId/edit', {
  name: 'teacher.edit',
  action() {
    BlazeLayout.render('adminLayout', { main: 'editCourse', sidebar: 'teacherSidebar' });
  },
});

teacherRoutes.route('/new/', {
  name: 'teacher.new',
  action() {
    BlazeLayout.render('adminLayout', { main: 'createCourse', sidebar: 'teacherSidebar' });
  },
});

// Redirect for all unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('minimalLayout', { main: 'appNotFound' });
  },
};
