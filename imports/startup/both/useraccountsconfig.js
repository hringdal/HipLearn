import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { FlowRouter } from 'meteor/kadira:flow-router';

AccountsTemplates.configure({
  showForgotPasswordLink: true,
  enablePasswordChange: true,
  defaultLayout: 'minimalLayout',
  // defaultTemplate: 'loginForm',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
  // Hooks
  onLogoutHook() {
    console.log('onLogoutHook');
    FlowRouter.go('root'); // redirect to sign-in or eventually homepage
    FlowRouter.reload(); // removes the navbar. TODO: this is too hacky
  },
  // ugly text on not logged in redirect
  texts: {
    errors: {
      mustBeLoggedIn: "You must login to be able to view this page",
    },
  },
});
// Configure signup-fields
AccountsTemplates.addField({
  _id: 'role',
  type: 'select',
  required: true,
  select: [
    {
      text: 'Student',
      value: 1,
    },
    {
      text: 'Teacher',
      value: 2,
    },
  ],
});
// Creates a route to /sign-in with loginLayout and atFullPageForm template
AccountsTemplates.configureRoute('signIn', {
  redirect() {
    const user = Meteor.user();
    if (user) {
      if (user.profile.role === 1) {
        FlowRouter.go('student.show');
        console.log('student');
      } else if (user.profile.role === 2) {
        FlowRouter.go('teacher.show');
        console.log('teacher');
      } else {
        console.log('should be an admin (role 3)');
        FlowRouter.go('teacher.show');
      }
    }
  },
});
AccountsTemplates.configureRoute('signUp', {
  name: 'signUp',
  redirect() {
    const user = Meteor.user();
    if (user) {
      if (user.profile.role === 1) {
        FlowRouter.go('student.show');
        console.log('student');
      } else if (user.profile.role === 2) {
        FlowRouter.go('teacher.show');
        console.log('teacher');
      } else {
        console.log('should be an admin (role 3)');
        FlowRouter.go('teacher.show');
      }
    }
  },
});
// Redirects every route to sign-in if user not logged in
FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn], { except: ['root'] });
