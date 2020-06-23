var group;

$(document).ready(function () {
    var btnStyle = `
        <button type="button" name="rename" class="btn btn-light btn-sm">Rename</button> 
        <button type="button" name="delete" class="btn btn-light btn-sm">Delete</button>
        `;
    var addBtn = `
        <button type="button" class="btn btn-secondary btn-sm" data-toggle="modal" data-target="#createModal">
            New Group
        </button>
        `;

    var groupsTable = $('#groups-table').DataTable({
        colReorder: true,
        responsive: true,
        ajax: {
            url: '/api/groups',
            dataSrc: '',
            data: 'json',
        },
        columns: [
            { data: 'groupname' },
            { data: null, defaultContent: btnStyle, width: '10rem' },
        ],
    });

    $('#groups-table_filter').append(addBtn);

    $('#groups-table tbody').on('click', 'button[name="rename"]', function () {
        group = groupsTable.row($(this).parents('tr')).data();
        $('input[name="groupname"]')[0].value = group.groupname;
        $('.err-msg').hide();
        $('#renameModal').modal('show');
    });

    $('#groups-table tbody').on('click', 'button[name="delete"]', function () {
        group = groupsTable.row($(this).parents('tr')).data();
        $('.group-name').html(group.groupname);
        $('.err-msg').hide();
        $('#deleteModal').modal('show');
    });

    $('button[name="groupRenameBtn"]').on('click', function () {
        var newname = $('input[name="groupname"]')[0].value;
        $.ajax({
            type: 'put',
            url: `/api/groups/${group.groupname}`,
            data: { groupname: newname },
            contentType: 'application/x-www-form-urlencoded',
            success: function (responseData, textStatus, jqXHR) {
                $('#renameModal').modal('hide');
                location.reload(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('.err-msg').show();
                $('.err-msg').html(jqXHR.responseJSON.errors[0]);
            },
        });
    });

    $('button[name="groupDeleteBtn"]').on('click', function () {
        $.ajax({
            type: 'delete',
            url: `/api/groups/${group.groupname}`,
            success: function (responseData, textStatus, jqXHR) {
                $('#renameModal').modal('hide');
                location.reload(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('.err-msg').show();
                $('.err-msg').html(jqXHR.responseJSON.errors[0]);
            },
        });
    });

    $('button[data-target="#createModal"]').on('click', function () {
        $('input[name="newGroupname"]').value = '';
    });

    $('button[name="groupCreateBtn"]').on('click', function () {
        var newname = $('input[name="newGroupname"]')[0].value;
        $.ajax({
            type: 'post',
            url: '/api/groups',
            data: { groupname: newname },
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
});
