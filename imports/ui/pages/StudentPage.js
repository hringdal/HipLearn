/**
 * Created by ingeborglianes on 23.03.2017.
 */
$(Document).ready(function() {
    $(".ui.sidebar").sidebar({
        context: $('.pusher')
    });

    $('a').click(function() { $('.ui.sidebar').sidebar('toggle'); });
});
/***
Package.describe({
    summary: "Student page"
});

Package.on_use(function (api) {
    api.use(['templating'], 'client');

    api.add_files('StudentPage.html', 'client');
});
 */