// [REVIEW] Put all these utils stuff in a separate file
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

$('#editUserModal').on('show.bs.modal', function (e) {
    $('#name').val(name);
    $.ajax({
        url: '/api/users',
        type: 'get'
    }).then((data) => {
        $('#firstname').val(data[0]['first_name']);
        $('#lastname').val(data[0]['last_name']);
        $('#email').val(data[0]['email']);
        $('#phone').val(data[0]['phone']);
        $('#company').val(data[0]['company']);
        console.log('your user info is here');
    });
});

// [REVIEW] to disable the .save-user button once it is clicked to avoid double submission
$('.save-user').click(function (e) {
    e.preventDefault();
    // disable the button here
    $.ajax({
        url: '/api/users',
        type: 'PUT',
        data: JSON.stringify($('#form-user').serializeFormJSON()),
        dataType: "json",
        contentType: "application/json"
    }).then((data) => {
        // re-enable the button here
        console.log('user infos updated');
        $('#editUserModal').modal('hide');
    });
});