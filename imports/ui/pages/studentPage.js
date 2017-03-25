import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

Template.studentPage.onRendered(() => {
  $('.ui.sidebar')
    .sidebar({ context: $('.context') })
  ;
});
