$(document).ready(function () {
    $('#users-table').dataTable({
        colReorder: true,
        responsive: true,
        select: true,
        ajax: {
            url: '/api/users',
            dataSrc: '',
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
        ],
    });

    $('#permissions-table').dataTable({
        responsive: true,
    });
});
