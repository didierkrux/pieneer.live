var hover_slide = -1;
var upload = [];
var graph_type = ['bar', 'pie', 'line'];
var presentation = {};
// get presentation data from the API
var presentation_id = (document.location.pathname == '/new_presentation/') ? '' : document.location.pathname.replace('/edit_presentation/', '');
var ajax_type = (document.location.pathname == '/new_presentation/') ? 'POST' : 'GET';
$.ajax({
    dataType: "json",
    contentType: "application/json",
    type: ajax_type,
    url: "/api_dk/presentation/" + presentation_id,
    success: init_slides
});

// [REVIEW] Use class to implement Image Slide, Poll Slide, Qna Slide
/*

  class Slide {
      initSlide() {

      }

      previewSlide() {

      }

      insertSlide () {

      }
  }

  class ImageSlide extends Slide {

  }

  Usage:

    if (presentation.slides) {
        for (slide of presentation.slides) {
            slide.initSlide();
        }
    }


 */

function init_slides(data) {
    presentation = data;
    console.log(presentation);
    $('#play-presentation').attr('href', '/presentation/' + presentation.id);
    // init first slide
    $('.list').append(`
    <div class="slide slide-html active">
        <div>
            <i class="fas fa-info-circle fa-2x mr-2"></i>Infos
        </div>
    </div>`);

    if (presentation.slides) {
        for (slide of presentation.slides) {
            var html_slide = "";
            if (slide.type == "image") {
                // [REVIEW] NOT SAFE~ slide might contain single quote (')
                html_slide = `
                <div class="slide slide-${slide.type}" data-json='` + JSON.stringify(slide) + `'>
                    <img src="${slide.link}">
                </div>`;
            } else if (slide.type == "poll") {
                html_slide = `
                <div class="slide slide-poll" data-json='`+ JSON.stringify(slide) + `'>
                    <div>
                        <i class="fas fa-chart-bar fa-2x mr-2"></i>Poll
                    </div>
                </div>`;
            } else if (slide.type == "q_a") {
                html_slide = `
                <div class="slide slide-q_a" data-json='`+ JSON.stringify(slide) + `'>
                    <div>
                        <i class="fas fa-question-circle fa-2x mr-2"></i>Q&A
                    </div>
                </div>`;
            }
            $('.list').append(html_slide);
        }
    }
    // init actions
    actionPos(0);
    $('.slide').eq(0).click();
}

function actionPos(new_hover = -1) {
    if (hover_slide != new_hover) {
        var hover_slide_dom = $('.slide').eq(new_hover);
        var offset = hover_slide_dom.position();
        hover_slide = new_hover;
        // [REVIEW] comment on the magical number
        var left = (hover_slide == 0) ? 37 : 16;
        $('div.actions').css({ top: offset.top + $('.list')[0].scrollTop + hover_slide_dom.height() + 6, left: left });
        if (hover_slide == 0) {
            $('#delete-slide').hide();
        } else {
            $('#delete-slide').show();
        }
    }
}
function previewSlide(slide_id) {
    $('.slide.active').removeClass('active');
    $('.slide').eq(slide_id).addClass('active');
    console.log('prev' + slide_id);
    if ($('.slide').eq(slide_id).hasClass('slide-html')) {
        var slide_html = `
        <form class="container mt-5" action="/api_dk/presentation/${presentation.id}" method="POST" id="form-infos">
            <h2><i class="fas fa-info-circle mr-2 mb-5"></i>Infos</h2>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="title">Title</label>
                <div class="col-sm-10">
                    <input class="form-control" type="text" name="title" value="${presentation.title}" id="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="location">Location</label>
                <div class="col-sm-10">
                    <input class="form-control" type="text" name="location" value="${presentation.location}" id="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="date">Date</label>
                <div class="col-sm-10">
                    <input class="form-control date" type="text" name="date" value="${presentation.date}" id="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="speaker">Speaker</label>
                <div class="col-sm-10">
                    <input class="form-control" type="text" name="speaker" value="${presentation.speaker}" id="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="email">Email</label>
                <div class="col-sm-10">
                    <input class="form-control" type="text" name="email" value="${presentation.email}" id="">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="phone">Phone</label>
                <div class="col-sm-10">
                    <input class="form-control" type="text" name="phone" value="${presentation.phone}" id="">
                </div>
            </div>
            <div>
                <button type="submit" class="btn btn-primary save-infos float-right">Save</button>
            </div>
        </form>
`;
        $('.preview').html(slide_html);
        $('.date').datetimepicker({ startDate: new Date() });
    } else if ($('.slide').eq(slide_id).hasClass('slide-image')) {
        $('.preview').html($('.slide').eq(slide_id).html());
    } else if ($('.slide').eq(slide_id).hasClass('slide-poll')) {
        var slide = JSON.parse($('.slide').eq(slide_id).attr('data-json'));
        var responses = '';
        for (const key in slide.answers) {
            var letter = String.fromCharCode("A".charCodeAt() + parseInt(key));
            responses += `
            <div class="form-group row mt-5">
                <label class="col-sm-2 col-form-label text-right" for="answer-${key}">Answer ${letter}</label>
                <div class="col-sm-10 pl-5">
                    <input class="form-control answer" type="text" id="answer-${key}" name="answers" value="${slide.answers[key]}">
                </div>
            </div>`;
        }
        var add_answer = (slide.answers.length < 6) ? '<button class="btn btn-info add-answer" type="button" title="Add answer"><i class="fas fa-plus-square"></i> Add answer</button>' : '';
        var select_graph_type = '';
        for (var type of graph_type) {
            select_graph_type += (type == slide.graph_type) ? `<option value="${type}" selected="selected">${type}</option>` : `<option value="${type}">${type}</option>`;
        }
        var slide_html = `
        <form class="container mt-5" action="/api/poll/${slide.id}" method="POST" id="form-poll">
            <h2><i class="fas fa-chart-bar mr-2 mb-5"></i>Poll</h2>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="question">Question</label>
                <div class="col-sm-10">
                    <input class="form-control" type="text" name="question" value="${slide.question}" id="question">
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="graph_type">Graph type</label>
                <div class="col-sm-10">
                    <select class="form-control" id="graph_type" name="graph_type">
                        ${select_graph_type}
                    </select>
                </div>
            </div>
            ${responses}
            <div>
                ${add_answer}
                <button type="submit" class="btn btn-primary save-poll float-right">Save</button>
            </div>
        </form>
`;
        $('.preview').html(slide_html);
    } else if ($('.slide').eq(slide_id).hasClass('slide-q_a')) {
        var slide = JSON.parse($('.slide').eq(slide_id).attr('data-json'));
        var slide_html = `
        <form class="container mt-5" action="/api/q_a/${slide.id}" method="POST" id="form-q_a">
            <h2><i class="fas fa-question-circle mr-2 mb-5"></i>Q&A</h2>
            <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="title">Q&A title</label>
                <div class="col-sm-10">
                    <input class="form-control" type="text" name="title" value="${slide.title}" id="title">
                </div>
            </div>
            <div>
                <button type="submit" class="btn btn-primary save-q_a float-right">Save</button>
            </div>
        </form>
`;
        $('.preview').html(slide_html);
    }
}
function insertImage(link) {
    $('.slide').eq(hover_slide).after(`
        <div class="slide slide-image" data-json='{"type":"image","link":"${link}"}'>
            <img src="${link}">
        </div>`);
    hover_slide++;
}
$('.list').on('mouseenter', 'div.slide', function (e) {
    actionPos($(".slide").index($(this)));
});
$('.list').on('click', 'div.slide', function (e) {
    previewSlide($(".slide").index($(this)));
});
$('a#save-presentation').click(function (e) {
    e.preventDefault; // [REVIEW] forgot to run ...nothing has done here 
    console.log('save-presentation');
    presentation.slides = [];
    $('.slide').each(function () {
        if (!$(this).hasClass('slide-html')) {
            var data_json = JSON.parse($(this).attr('data-json'));
            presentation.slides.push(data_json);
        }
    });
    $.ajax({
        type: 'PUT',
        url: '/api_dk/presentation/' + presentation.id,
        data: presentation
    }).then((data) => {
        console.log('infos updated');
    });
    console.log(presentation);
    $(this).blur();
    return false; // [REVIEW] this is the old way of e.preventDefault(), not necessary any more
});
$('.slide:last-child').mouseenter();
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});
$('.presentation .actions').on('click', 'button', function (e) {
    e.preventDefault();
    console.log('add to slide ' + $(this).attr('id') + ' position ' + hover_slide);
    if ($(this).attr('id') == 'insert-ppt') {
        upload = [];
        $('#uploadPPTModal').modal('show', {
            keyboard: true
        });
    } else if ($(this).attr('id') == 'insert-image') {
        upload = [];
        $('#uploadImageModal').modal('show');
    } else if ($(this).attr('id') == 'insert-poll') {
        if ($('.slide-poll').length > 0) {
            $(".alert-warning").html('Only 1 poll allowed per presentation').show();
            $(".alert-warning").fadeTo(2000, 500).slideUp(500, function () {
                $(".alert-warning").hide('close');
            });
        } else {
            $.ajax({
                type: 'POST',
                url: '/api_dk/poll',
            }).then((id) => {
                $('.slide').eq(hover_slide).after(`
                <div class="slide slide-poll" data-json='{"type":"poll","id":${id},"question":"","graph_type":"bar","answers":["",""]}'>
                    <div>
                        <i class="fas fa-chart-bar fa-2x mr-2"></i>Poll
                    </div>
                </div>`);
                $('.slide').eq(1 + hover_slide).click();
            });
        }
    } else if ($(this).attr('id') == 'insert-qa') {
        if ($('.slide-q_a').length > 0) {
            $(".alert-warning").html('Only 1 Q/A allowed per presentation').show();
            $(".alert-warning").fadeTo(2000, 500).slideUp(500, function () {
                $(".alert-warning").hide('close');
            });
        } else {
            $('.slide').eq(hover_slide).after(`
        <div class="slide slide-q_a" data-json='{"type":"q_a","title":"","questions":[]}'>
            <div>
                <i class="fas fa-question-circle fa-2x mr-2"></i>Q&A
            </div>
        </div>`);
            $('.slide').eq(1 + hover_slide).click();
        }
    } else if ($(this).attr('id') == 'delete-slide') {
        $('.slide').eq(hover_slide).remove();
        if (hover_slide == $('.slide').length) {
            $('.slide').eq(hover_slide - 1).mouseenter().click();
        } else {
            $('.slide').eq(hover_slide).click();
        }
    }
    $(this).blur();
});

// upload files
Dropzone.options.myDropzonePpt = {
    acceptedFiles: ".ppt,.pptx",
    init: function () {
        this.on("success", function (file, file_name) {
            if (file_name != 'undefined') {
                upload.push(file_name);
                console.log('upload complete');
                console.log(file_name);
            } else {
                console.log('upload error');
            }
        });
    }
};
Dropzone.options.myDropzoneImage = {
    acceptedFiles: "image/jpeg,image/png",
    init: function () {
        this.on("success", function (file, file_name) {
            if (file_name != 'undefined') {
                upload.push(file_name);
                console.log('upload complete');
                console.log(file_name);
            } else {
                console.log('upload error');
            }
        });
    }
};
$('.insert-ppt').click(function () {
    for (var img of upload) {
        insertImage('/slides/' + img);
    }
    upload = [];
    $('.dz-preview').remove();
    $('.dropzone.dz-started .dz-message').show();
    $('#uploadPPTModal').modal('hide');
});
$('.insert-image').click(function () {
    for (var img of upload) {
        insertImage('/slides/' + img);
    }
    upload = [];
    $('.dz-preview').remove();
    $('.dropzone.dz-started .dz-message').show();
    $('#uploadImageModal').modal('hide');
});

(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

$('.preview').on('click', '.save-infos', function (e) {
    e.preventDefault();
    var infos = $('#form-infos').serializeFormJSON();
    presentation.title = infos.title;
    presentation.date = infos.date;
    presentation.location = infos.location;
    presentation.speaker = infos.speaker;
    presentation.email = infos.email;
    presentation.phone = infos.phone;
    $('a#save-presentation').click();
});

$('.preview').on('click', '.add-answer', function (e) {
    var nb_anwsers = $('.answer').length;
    var letter = String.fromCharCode("A".charCodeAt() + nb_anwsers);
    if (nb_anwsers < 6) {
        $(this).before(`
        <div class="form-group row mt-5">
            <label class="col-sm-2 col-form-label text-right" for="answer-${nb_anwsers}">Answer ${letter}</label>
            <div class="col-sm-10 pl-5">
                <input class="form-control answer" type="text" id="answer-${nb_anwsers}" name="answers" value="">
            </div>
        </div>`);
        if ($('.answer').length == 6) {
            $('.add-answer').hide();
        }
    }
});

$('.preview').on('click', '.save-poll', function (e) {
    e.preventDefault();
    var poll = $('#form-poll').serializeFormJSON();
    var data_json = JSON.parse($('.slide.active').attr('data-json'));
    console.log(poll);
    console.log(data_json);
    data_json.question = poll.question;
    data_json.graph_type = poll.graph_type;
    data_json.answers = poll.answers;
    $('.slide.active').attr('data-json', JSON.stringify(data_json));
    $('a#save-presentation').click();
});

$('.preview').on('click', '.save-q_a', function (e) {
    e.preventDefault();
    var q_a = $('#form-q_a').serializeFormJSON();
    var data_json = JSON.parse($('.slide.active').attr('data-json'));
    console.log(data_json);
    data_json.title = q_a.title;
    $('.slide.active').attr('data-json', JSON.stringify(data_json));
    $('a#save-presentation').click();
});