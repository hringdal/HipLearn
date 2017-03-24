/**
 * Created by ingeborglianes on 23.03.2017.
 */
$(Document).ready(function() {
    $(".ui.sidebar").sidebar({
        context: $('.pusher')
    });

    $('a').click(function() { $('.ui.sidebar').sidebar('toggle'); });
});
