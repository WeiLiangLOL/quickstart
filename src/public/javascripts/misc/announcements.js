$(document).ready(function () {
    $.ajax('/api/announcements?sort=-date', {
        method: 'get',
        dataType: 'json',
        success: function (data, status, xhr) {
            for (let post of data) {
                let date = new Date(post.date);
                $('.notice-container').append(`
            <div class="notice">
                <h2 class="mb-0">${post.title}</h2>
                <p class="mb-4 text-muted font-italic"><b>${
                    post.username
                }</b>, <b>${date.toLocaleString()}</b></p>
                <p>${post.description}</p>
                <div class="line"></div>
            </div>
            `);
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            console.log(jqXhr);
        },
    });

    $('button[name="postSubmitBtn"]').on('click', function () {
        var title = $('input[name="title"]').val();
        var username = $('input[name="username"]').val();
        var description = $('textarea[name="description"]').val();

        if (!title || !description) {
            $('.err-msg').show();
            $('.err-msg').html('Empty field(s) present!');
            return;
        }

        $.ajax({
            type: 'post',
            url: '/api/announcements',
            data: { title, username, description },
            contentType: 'application/x-www-form-urlencoded',
            success: function (responseData, textStatus, jqXHR) {
                $('#createPostModal').modal('hide');
                location.reload(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('.err-msg').show();
                $('.err-msg').html(jqXHR.responseJSON.errors[0]);
            },
        });
    });
});
