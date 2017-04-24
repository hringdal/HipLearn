import { Meteor } from 'meteor/meteor';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';

AccountsTemplates.configure({
  showForgotPasswordLink: true,
  enablePasswordChange: true,
  defaultLayout: 'minimalLayout',
  // defaultTemplate: 'loginForm',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
  // Hooks
  onLogoutHook() {
    FlowRouter.go('root'); // redirect to sign-in or eventually homepage
    FlowRouter.reload(); // removes the navbar
  },
  // ugly text on not logged in redirect
  texts: {
    title: {
      signIn: 'Log-in to your account',
      signUp: 'Create a New Account',
    },
    button: {
      signIn: 'Login',
    },
    errors: {
      mustBeLoggedIn: 'You must login to be able to view this page',
      loginForbidden: 'Your username or password seems to be wrong. Try again',
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
    Tracker.autorun(function waitOnLogin() {
      const user = Meteor.user();
      if (user) {
        if (user.profile.role === 1) {
          FlowRouter.go('student.show');
        } else if (user.profile.role === 2) {
          FlowRouter.go('teacher.show');
        } else {
          // should be an admin -> role === 3
          FlowRouter.go('teacher.show');
        }
      } else {
        console.log('no user');
      }
    });
  },
});
AccountsTemplates.configureRoute('signUp', {
  name: 'signUp',
  redirect() {
    Tracker.autorun(function waitOnLogin() {
      const user = Meteor.user();
      if (user) {
        if (user.profile.role === 1) {
          FlowRouter.go('student.show');
        } else if (user.profile.role === 2) {
          FlowRouter.go('teacher.show');
        } else {
          FlowRouter.go('teacher.show');
        }
      }
    });
  },
});

AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');

// Redirects every route to sign-in if user not logged in
FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn], { except: ['root'] });
