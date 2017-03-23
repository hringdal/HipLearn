import { AccountsTemplates } from 'meteor/useraccounts:core';
// import { FlowRouter } from 'meteor/kadira:flow-router';

AccountsTemplates.configure({
  showForgotPasswordLink: true,
  enablePasswordChange: true,
  defaultTemplate: 'List',
  defaultLayout: 'App_body',
  defaultContentRegion: 'main',
  defaultLayoutRegions: {},
});
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

/*AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('changePwd');*/

// FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn]);
