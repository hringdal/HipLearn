import {List} from '../../api/list.js';

Template.list.helpers({
    list() {
        return List.find({});
    },
});

Template.list.events({


});




