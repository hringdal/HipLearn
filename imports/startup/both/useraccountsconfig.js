import { AccountsTemplates } from 'meteor/useraccounts:core';
import { FlowRouter } from 'meteor/kadira:flow-router';

AccountsTemplates.configure({
  showForgotPasswordLink: true,
  enablePasswordChange: true,
  defaultLayout: 'loginLayout',
  // defaultTemplate: 'loginForm',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
  // Hooks
  onLogoutHook() {
    console.log('onLogoutHook');
    FlowRouter.go('/sign-in'); // redirect to sign-in or eventually homepage
  },
  // ugly text on not logged in redirect
  texts: {
    errors: {
      mustBeLoggedIn: "Ugly text because you've been redirected",
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
AccountsTemplates.configureRoute('signIn');

// Redirects every route to sign-in if user not logged in
FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn]);
