// init drawing
var ctx = Zwibbler.create("drawing", {
    showToolbar: false,
    showColourPanel: false
});
ctx.on("tool-changed", function (toolname) {
    console.log(toolname);
    if (toolname == 'pick') {
        $('.tools a.selected').removeClass('selected');
        $('.tools a.select').addClass('selected');
    }
});
var presentation_id = document.location.pathname.replace('/presentation/', '');
var presentation = '';
var nb_slides = 1;
var current_slide = 0;
var socket = io();
// get presentation data from the API
// [REVIEW] might not be a good idea to just AJAX without DOM ready
$.ajax({
    dataType: "json",
    url: "/api_dk/presentation/" + presentation_id,
    success: init_slides
});
function init_slides(data) {
    presentation = data;
    console.log(presentation);
    nb_slides = (presentation.slides) ? presentation.slides.length : 1;

    $('title').html(presentation.title + ' | powered by Pieneer - Live Presentation made Interactive and Easy');

    // init first slide
    // var event_date = formatDate(presentation.date);

    // [REVIEW] XSS
    // what if the `presentation.title` is <script>alert('hi');</script>
    $('#presentation').append(`
    <div class="slide slide-0 slide-html active">
        <h1 class="pt-5">${presentation.title}</h1>
        <h2 class="mt-5">📍 ${presentation.location}</h2>
        <h2 class="mt-5">${presentation.speaker}</h2>
        <div class="mt-5" id="qrcode"></div>
    </div>`);

    var mobile_url = document.location.protocol + '//' + document.location.host + '/event/' + presentation_id;

    $('#url').html(mobile_url);

    $('#qrcode').qrcode(mobile_url);

    // init next slides
    var i = 1;
    for (slide of presentation.slides) {
        //console.log(slide);
        var html_slide = "";
        if (slide.type == "image") {
            html_slide = `
            <div class="slide slide-${i} slide-${slide.type}">
                <img src="${slide.link}">
            </div>`;
        } else if (slide.type == "poll") {
            var responses = '';
            for (const key in slide.answers) {
                responses += `<li class="list-group-item item-${key}">${slide.answers[key]}</li>`;
            }
            html_slide = `
            <div class="slide slide-${i} slide-${slide.type}" data-json='` + JSON.stringify(slide) + `'>
                <div class="question-container">
                    <h1>${slide.question}</h1>
                </div>
                <div class="chart-container">
                    <canvas id="myChart-${slide.id}"></canvas>
                </div>
            </div>`;
        } else if (slide.type == "q_a") {
            html_slide = `
            <div class="slide slide-${i} slide-${slide.type}">
            </div>`;
        }
        $('#presentation').append(html_slide);
        i++;
    }
    // adding canvas for other slides
    for (let i = 1; i <= nb_slides; i++) {
        ctx.addPage();
    }
}
function update_slide() {
    if ($('.slide.active').hasClass('slide-poll')) {
        slide = JSON.parse($('.slide.active').attr('data-json'));
        socket.emit("vote-stop", slide.id); // id
    }
    $('.slide.active').removeClass('active');
    $('.slide.slide-' + current_slide).addClass('active');
    ctx.setCurrentPage(current_slide);
    $('#drawing').removeClass('white-background');

    if ($('.slide.active').hasClass('slide-poll')) {
        slide = JSON.parse($('.slide.active').attr('data-json'));
        socket.emit("vote-start", slide.id); // id
    }

    // actions for this slide
    if (current_slide > 0) {
        slide = presentation.slides[current_slide - 1];
        if (slide.type == 'poll') {
            $.ajax({
                dataType: "json",
                url: "/api_dk/poll/" + slide.id,
                success: function (json) {
                    display_chart(slide.id, json.data);
                }
            });
        } else if (slide.type == 'q_a') {
            $.ajax({
                dataType: "json",
                type: 'GET',
                url: "/api_dk/q_a/" + presentation.id,
                success: function (q_a) {
                    console.log(q_a);
                    var questions = '';
                    for (const question of q_a) {
                        var likes = (question.likes > 0) ? `<i class="fas fa-thumbs-up fa-lg mr-2"> ${question.likes}</i>` : '';
                        questions += `
                    <li class="list-group-item">
                        <div class="user text-left">
                            <i class="far fa-user"></i> ${question.name}
                        </div>
                        <div class="question d-flex align-items-center justify-content-center">
                            ${question.question}
                            <div class="ml-auto justify-content-end">
                            ${likes}
                            </div>
                        </div>
                    </li>`;
                    }
                    html_slide = `
                    <div class="q_a-container">
                        <h1>${slide.title}</h1>
                        <ul class="list-group mt-5">
                            ${questions}
                        </ul>
                    </div>`;
                    $('.slide-' + current_slide).html(html_slide);
                }
            });
        }
    }
}
function display_chart(id, data) {

    var ctx = document.getElementById("myChart-" + id);

    var labels = ["A", "B", "C", "D", "E", "F"];
    labels = labels.slice(0, slide.answers.length);
    labels = slide.answers; // label as answers
    var myChart = new Chart(ctx, {
        type: slide.graph_type,
        data: {
            labels: labels,
            datasets: [{
                label: "",
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.5)",
                    "rgba(75, 192, 192, 0.5)",
                    "rgba(54, 162, 235, 0.5)",
                    "rgba(255, 206, 86, 0.5)",
                    "rgba(153, 102, 255, 0.5)",
                    "rgba(255, 159, 64, 0.5)"
                ],
                borderColor: [
                    "rgba(255,99,132,1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)"
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    socket.on("upvote", val => {
        console.log('received upvote for ' + val);
        myChart.data.datasets[0].data[val] += 1;
        myChart.update();
    });
}

// when page loaded
$(function () {
    // activate tooltip
    $('[data-toggle="tooltip"]').tooltip();
    // activate shortcuts
    $('[data-shortcut]').each(function () {
        var element = $(this);
        key = element.data('shortcut');

        $(document).on('keyup', null, String(key), function () {
            element.trigger('focus').trigger('click');
        });
    });
    // tool actions
    $('.tools a').click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('selected')) {
            var action = $(this).attr('class');
            if (action == 'select') {
                ctx.usePickTool();
            } else if (action == 'pen') {
                ctx.useBrushTool({
                    lineWidth: 8,
                });
            } else if (action == 'eraser') {
                ctx.useBrushTool({
                    lineWidth: 8,
                    strokeStyle: "erase"
                });
            } else if (action == 'line') {
                ctx.useLineTool();
            } else if (action == 'rectangle') {
                ctx.useRectangleTool();
            } else if (action == 'circle') {
                ctx.useCircleTool();
            } else if (action == 'text') {
                ctx.useTextTool();
            } else if (action == 'background') {
                $('#drawing').toggleClass('white-background');
            } else if (action == 'undo') {
                ctx.undo();
            } else if (action == 'redo') {
                ctx.redo();
            }
            if (action != 'background' && action != 'undo' && action != 'redo') {
                $('.tools a.selected').removeClass('selected');
                $(this).addClass('selected');
            }
        }
        $(this).blur();
    });
    $('.colors a').click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('selected')) {
            var color = $(this).find('div').css('background-color');
            ctx.setColour(color, true);
            $('.colors a.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        $(this).blur();
    });
    // slide navigation
    $('.previous-slide').click(function (e) {
        e.preventDefault();
        current_slide = (current_slide == 0) ? nb_slides : current_slide - 1;
        update_slide();
        $(this).blur();
    });
    $('.next-slide').click(function (e) {
        e.preventDefault();
        current_slide = (current_slide == nb_slides) ? 0 : current_slide + 1;
        update_slide();
        $(this).blur();
    });
    // control fadeout after 2 seconds
    var fadeout = null;
    $("html").mousemove(function () {
        $(".control").stop().show();
        if (fadeout != null) {
            clearTimeout(fadeout);
        }
        fadeout = setTimeout(hide_control, 2000);
    });
    function hide_control() {
        if ($('.tooltip').length == 0) {
            $(".control").stop().hide();
        }
    }
    $("html").mousemove();
    // fullscreen
    $('.toggle-fullscreen').click(function (e) {
        e.preventDefault();
        toggleFullScreen();
        $(this).blur();
    });
    // selection default tools
    $('.pen').click();
    $('.color-black').click();
});

function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

// [REVIEW] use moment.js (optional)... if you consider timezone
function formatDate(d) {
    d = new Date(d * 1000);
    return d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
}