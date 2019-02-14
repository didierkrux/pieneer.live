var presentation = {};
var socket = io();
var poll_id = '';
$('.badge-pill').hide();
socket.on("vote-start", id => {
    $('.badge-pill').show();
    $('#submit-poll').removeClass('disabled');
});

socket.on("vote-stop", id => {
    $('.badge-pill').hide();
    //$('#submit-poll').addClass('disabled');
});
var presentation_id = document.location.pathname.replace('/event/', '');
$.ajax({
    dataType: "json",
    type: 'GET',
    url: "/api_dk/presentation/" + presentation_id,
    success: init_event
});

function init_event(data) {
    presentation = data;
    console.log(presentation);
    // TODO: dyn map
    // TODO: dyn vcf link
    var html_info = `<p>Description: ${presentation.title}</p>
    <p>${presentation.date}</p>
    <p>📍 ${presentation.location}</p>
    <div class="text-center">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.7974310464824!2d114.14924791540757!3d22.28566198533119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3404007c40b40001%3A0x959df826b8e21b02!2snaked+Hub+Bonham+Strand+Coworking+Space+Hong+Kong!5e0!3m2!1sen!2shk!4v1525244511538"
        frameborder="0" style="border:0" allowfullscreen></iframe>
    </div>
    <p>Speaker: ${presentation.speaker}</p>
    <p>
        <a href="mailto:${presentation.email}">
            <i class="fas fa-envelope fa-lg"></i> ${presentation.email}
        </a>
    </p>
    <p>
        <a href="tel:${presentation.phone}">
            <i class="fas fa-phone fa-lg"></i> ${presentation.phone}
        </a>
    </p>
    <p>
        <a href="/api_dk/vcard/${presentation.user_id}">
            <i class="fas fa-download fa-lg"></i> Add contact to my phone
        </a>
    </p>`;
    $('#info .container').html(html_info);
    // [REVIEW] use `let` instead `var` esp in for-loop
    for (var slide of presentation.slides) {
        if (slide.type == 'poll') {
            poll_id = slide.id;
            $('#poll_question').html(slide.question);
            var i = 0;
            for (var answer of slide.answers) {
                var html_poll = `
            <li class="list-group-item">
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck${i}" name="vote" value="${i}">
                    <label class="custom-control-label" for="customCheck${i}">${answer}</label>
                </div>
            </li>`;
                $('ul.poll').append(html_poll);
                i++;
            }
        } else if (slide.type == 'q_a') {
            $.ajax({
                dataType: "json",
                type: 'GET',
                url: "/api_dk/q_a/" + presentation.id,
                success: function (questions) {
                    for (var question of questions) {
                        var likes = (question.likes > 0) ? `<i class="fas fa-thumbs-up fa-lg mr-2">${question.likes}</i>` : '<i class="fas fa-thumbs-up fa-lg mr-2"></i>';
                        var html_question = `<li class="list-group-item">
                            <div class="user">
                                <i class="far fa-user"></i> ${question.name}
                            </div>
                            <div class="question d-flex align-items-center justify-content-center">
                                ${question.question}
                                <div class="ml-auto justify-content-end">
                                    <a href="#" alt="Like" id="question-${question.id}">
                                        ${likes}
                                    </a>
                                </div>
                            </div>
                        </li>`;
                        $('ul.questions').append(html_question);
                    }
                }
            });
        }
    }
}

var name = (typeof $.cookie("name") == 'undefined') ? '' : $.cookie("name");
$('#editNameModal').on('show.bs.modal', function (e) {
    $('#name').val(name);
});
$('#editNameModal').on('hide.bs.modal', function (e) {
    if (name == '') {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    }
});
$('#form-name').submit(function (e) {
    e.preventDefault();
    $('.savename').click();
    return false;
});
$('.savename').click(function () {
    if ($('#name').val() != '') {
        name = $('#name').val();
        $.cookie("name", name, { expires: 365, path: '/' });
        $('#editNameModal').modal('hide');
    }
});
$('#send_vote').submit(function (e) {
    e.preventDefault();
    $('#submit-poll').click();
    return false;
});
$('#submit-poll').click(function (e) {
    e.preventDefault();
    if (!$(this).hasClass('disabled')) {
        var votes = $('#send_vote').serializeArray();
        // [REVIEW] variable declaration!! `let`
        for (vote of votes) {
            console.log('upvote' + vote.value);
            socket.emit("upvote", { "id": poll_id, "vote": vote.value });
            $(this).addClass('disabled');
        }
    }
});
$('.questions').on('click', '.fa-thumbs-up', function (e) {
    e.preventDefault();
    var thumbs_up = ($(this).text() == '') ? 0 : parseInt($(this).text());
    if ($(this).hasClass('liked')) {
        socket.emit("unlike-question", { "id": $(this).parent().attr('id').replace('question-', '') });
    } else {
        socket.emit("like-question", { "id": $(this).parent().attr('id').replace('question-', '') });
    }
    $(this).toggleClass('liked');
});
$('#send_question').submit(function (e) {
    e.preventDefault();
    var question = $('#question').val();
    if (question != '') {
        socket.emit("send-question", { "name": name, "question": question, "presentation_id": presentation.id });
        $('#question').val('');
    }
});
socket.on("new-question", question => {
    var html_question = `
    <li class="list-group-item">
        <div class="user">
            <i class="far fa-user"></i> ${question.name}
        </div>
        <div class="question d-flex align-items-center justify-content-center">
            ${question.question}
            <div class="ml-auto justify-content-end">
                <a href="#" alt="Like" id="question-${question.id}">
                    <i class="fas fa-thumbs-up fa-lg"></i>
                </a>
            </div>
        </div>
    </li>`;
    $('.questions').append(html_question);
    scrollDown();
});
socket.on("update-like-question", question => {
    console.log('update-like-question');
    console.log(question);
    var nb_likes = (question.likes == 0) ? '' : '' + question.likes;
    var html_likes = ($('#question-' + question.id + ' i').hasClass('liked')) ? '<i class="fas fa-thumbs-up fa-lg mr-2 liked">' + nb_likes + '</i> ' : '<i class="fas fa-thumbs-up fa-lg mr-2">' + nb_likes + '</i> ';
    console.log(html_likes);
    $('#question-' + question.id).html(html_likes);
});
function scrollDown() {
    $('html, body').animate({ scrollTop: $('.questions')[0].scrollHeight }, 0);
}
if (name == '')
    $('#editNameModal').modal('show');




