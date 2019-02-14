$(() => {
    const socket = io('/testroom');

    $(".vote-button").click(function () {
        console.log($(this).data('vote'));
        socket.emit("vote", $(this).data('vote'));
    });
});