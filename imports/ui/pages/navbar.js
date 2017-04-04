import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';

Template.atNavButtonCustom.replaces('atNavButton');

Template.navbar.onRendered(() => {
  $('.ui.dropdown')
    .dropdown()
  ;
});

Template.navbar.helpers({
  userEmail() {
    return Meteor.user().emails[0].address;
  },
  userRole() {
    if (Meteor.user()) {
      const role = Meteor.user().profile.role;
      if (role === 1) {
        return 'student.show';
      } else if (role === 2) {
        return 'teacher.show';
      }
      return 'admin.show';
    }
    return '#';
  },
});

Template.navbar.events({
  // adds active class to menu items when clicked to simulate moving between pages
  // Issue: makes notifications active right now
  /*'click .menu .item': function activeItem(event) {
    event.preventDefault();
    const $target = $(event.currentTarget);
    if (!$target.hasClass('active') && !$target.hasClass('header')) {
      $target.addClass('active');
    }
    $target.siblings('.item').removeClass('active');
  },*/
  /*'click .item.toggle': function slideDown(event) {
    event.preventDefault();
    const $menu = $('.ui.vertical.menu');
    $menu.transition({
      animation: 'slide down',
      onComplete() {
        if ($menu.hasClass('hidden')) {
          $menu.hide();
        } else {
          $menu.show();
        }
      },
    });
  },*/
});
