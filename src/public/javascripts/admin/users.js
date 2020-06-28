$(document).ready(function () {
    var user;

    var btnStyle = `
        <button type="button" name="updateUser" class="btn btn-light btn-sm">Update</button> 
        <button type="button" name="deleteUser" class="btn btn-light btn-sm">Delete</button>
        `;
    var addBtn = `
        <button type="button" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#createUserModal">
            New User
        </button>
        `;

    var usersTable = $('#users-table').DataTable({
        colReorder: true,
        responsive: true,
        ajax: {
            url: '/api/users',
            dataSrc: function (users) {
                for (let user of users) {
                    if (user.gender == 0) user.gender = 'Unknown';
                    if (user.gender == 1) user.gender = 'Male';
                    if (user.gender == 2) user.gender = 'Female';
                    if (user.gender == 9) user.gender = 'Others';
                }
                return users;
            },
            data: 'json',
        },
        columns: [
            { data: 'username' },
            { data: 'firstname' },
            { data: 'lastname' },
            { data: 'cellphone' },
            { data: 'email' },
            { data: 'date_of_birth' },
            { data: 'gender' },
            { data: 'nationality' },
            { data: 'allow_login' },
            { data: null, defaultContent: btnStyle, width: '10rem' },
        ],
    });

    $('#users-table_filter').append(addBtn);

    $('button[data-target="#createModal"]').on('click', function () {
        $('input[name="newUsername"]').val('');
        $('input[name="newPassword"]').val('');
        $('input[name="newFirstname"]').val('');
        $('input[name="newLastname"]').val('');
        $('input[name="newCellphone"]').val('');
        $('input[name="newEmail"]').val('');
        $('input[name="newDateOfBirth"]').val('');
        $('input[name="newNationality"]').val('');
    });

    $('button[name="userCreateBtn"]').on('click', function () {
        var newUsername = $('input[name="newUsername"]').val();
        var newPassword = $('input[name="newPassword"]').val();
        var newFirstname = $('input[name="newFirstname"]').val();
        var newLastname = $('input[name="newLastname"]').val();
        var newCellphone = $('input[name="newCellphone"]').val();
        var newEmail = $('input[name="newEmail"]').val();
        var newDateOfBirth = $('input[name="newDateOfBirth"]').val();
        var newGender = $('select[name="newGender"]').children('option:selected').val();
        var newNationality = $('input[name="newNationality"]').val();
        var newAllowLogin = $('input[name="newAllowLogin"]').is(':checked');

        $.ajax({
            type: 'post',
            url: '/api/users',
            data: {
                username: newUsername,
                password: newPassword,
                firstname: newFirstname,
                lastname: newLastname,
                cellphone: newCellphone,
                email: newEmail,
                date_of_birth: newDateOfBirth,
                gender: newGender,
                nationality: newNationality,
                allow_login: newAllowLogin
            },
            contentType: 'application/x-www-form-urlencoded',
            success: function (responseData, textStatus, jqXHR) {
                $('#createModal').modal('hide');
                location.reload(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('.err-msg').show();
                $('.err-msg').html(jqXHR.responseJSON.errors[0]);
            },
        });
    });

    $('#users-table tbody').on('click', 'button[name="deleteUser"]', function () {
        user = usersTable.row($(this).parents('tr')).data();
        $('.user-name').html(user.username);
        $('.err-msg').hide();
        $('#deleteUserModal').modal('show');
    });

    $('button[name="userDeleteBtn"]').on('click', function () {
        $.ajax({
            type: 'delete',
            url: `/api/users/${user.username}`,
            success: function (responseData, textStatus, jqXHR) {
                $('#deleteUserModal').modal('hide');
                location.reload(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('.err-msg').show();
                $('.err-msg').html(jqXHR.responseJSON.errors[0]);
            },
        });
    });

    $('#permissions-table').dataTable({
        responsive: true,
    });
});