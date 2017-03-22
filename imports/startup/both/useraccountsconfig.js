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
const pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
    _id: 'username',
    type: 'text',
    required: true,
    lowercase: true,
  },
  pwd,
]);

AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('changePwd');

// FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn]);
