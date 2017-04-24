import { Accounts } from 'meteor/accounts-base';

Accounts.emailTemplates.siteName = 'HipLearn';
Accounts.emailTemplates.from = 'HipLearn <no-reply@hiplearn.me>';

Accounts.emailTemplates.resetPassword = {
  subject() {
    return 'Reset your password on HipLearn';
  },
  text(user, url) {
    return `Hello!
Click the link below to reset your password on HipLearn.
${url}
If you didn't request this email, please ignore it.
Thanks,
The HipLearn staff
`;
  },
};
