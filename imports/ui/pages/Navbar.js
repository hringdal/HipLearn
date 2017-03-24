import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

Template.navbar.onRendered(() => {
  $('.ui.dropdown')
    .dropdown()
  ;
});
