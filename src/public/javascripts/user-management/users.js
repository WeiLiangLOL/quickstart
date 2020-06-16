$(document).ready(function () {
    $('#users-table').dataTable({
        responsive: true,
        ajax: {
            url: '/api/users',
            dataSrc: '',
            data: 'json',
            autoFill: true,
            colReorder: true,
            responsive: true,
            select: true,
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
});
