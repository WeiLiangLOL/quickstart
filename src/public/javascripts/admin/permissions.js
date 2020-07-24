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

    $('#permissions-table').dataTable({
        colReorder: true,
        responsive: true,
        ajax: {
            url: '/api/users',
            dataSrc: function (users) {
                for (let user of users) {
                    user.role_member = [];
                    user.role_observer = [];
                    user.role_staff = [];
                    for (let membership of user.memberships) {
                        switch(membership.rolename) {
                            case 'member':
                                user.role_member.push(membership.groupname); break;
                            case 'observer':
                                user.role_observer.push(membership.groupname); break;
                            case 'staff':
                                user.role_staff.push(membership.groupname); break;
                            default:
                                console.log('Invalid rolename "' + membership.rolename + '"');
                        }
                    }
                    user.priv_usermgmt = (user.privilege) ? user.privilege.user_mgmt_priv : false;
                    user.priv_datamgmt = (user.privilege) ? user.privilege.data_mgmt_priv : false;
                }
                return users;
            },
            data: 'json',
        },
        columns: [
            { data: 'username' },
            { data: 'role_member' },
            { data: 'role_observer' },
            { data: 'role_staff' },
            { data: 'priv_usermgmt' },
            { data: 'priv_datamgmt' },
            //{ data: null, defaultContent: btnStyle, width: '10rem' },
        ],
    });

});
