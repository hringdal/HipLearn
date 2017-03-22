import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
// import Tasks from '../../api/tasks.js';

Template.List.onRendered(() => {
  $('.list .master.checkbox')
    .checkbox({
      // check all children
      onChecked() {
        const $childCheckbox = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
        $childCheckbox.checkbox('check');
      }, // uncheck all children
      onUnchecked() {
        const $childCheckbox = $(this).closest('.checkbox').siblings('.list').find('.checkbox');
        $childCheckbox.checkbox('uncheck');
      },
    });
  $('.list .child.checkbox')
    .checkbox({
      // Fire on load to set parent value
      fireOnInit: true, // Change parent state on each child checkbox change
      onChange() {
        let $listGroup = $(this).closest('.list'),
          $parentCheckbox = $listGroup.closest('.item').children('.checkbox'),
          $checkbox = $listGroup.find('.checkbox'),
          allChecked = true,
          allUnchecked = true;
        // check to see if all other siblings are checked or unchecked
        $checkbox.each(function () {
          if ($(this).checkbox('is checked')) {
            allUnchecked = false;
          } else {
            allChecked = false;
          }
        });
        // set parent checkbox state, but dont trigger its onChange callback
        if (allChecked) {
          $parentCheckbox.checkbox('set checked');
        } else if (allUnchecked) {
          $parentCheckbox.checkbox('set unchecked');
        } else {
          $parentCheckbox.checkbox('set indeterminate');
        }
      },
    });
});

Template.List.helpers({
  tasks: [
    { text: '1.1 What is the internet?' },
    { text: '1.2 The Network Edge' },
    { text: '1.3 The Network Core' },
    { text: '1.4 The Network Inbetween' },
  ],
});
