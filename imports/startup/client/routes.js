import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Routes
FlowRouter.route('/', {
  name: 'root',
  action() {
        if(Meteor.user()){
            BlazeLayout.render('mainLayout', { main: 'frontpage' })
        }else{
            BlazeLayout.render('minimalLayout', { main: 'frontpage' })
        }
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
    BlazeLayout.render('mainLayout', { main: 'listStudentBooks' });
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
    BlazeLayout.render('mainLayout', { main: 'teacherPage2', sidebar: 'teacherSidebar' });
  },
});

FlowRouter.route('/teacher/course/:courseId', {
  name: 'teacher.course',
  action() {
    BlazeLayout.render('mainLayout', { main: 'teacherPage2', sidebar: 'teacherSidebar' });
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
