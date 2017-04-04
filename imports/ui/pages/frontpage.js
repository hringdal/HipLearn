import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';

Template.frontpage.onRendered(() => {
  $('body').addClass('temporary-bg');
});

Template.frontpage.onDestroyed(() => {
  $('body').removeClass('temporary-bg');
});
