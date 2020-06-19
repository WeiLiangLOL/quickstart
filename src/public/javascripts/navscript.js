var alias = {
    '': 'index',
};

function isSubmenu(item) {
    return item.parentElement.classList.contains('collapse');
}

$(document).ready(function () {
    // Collapsible sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Highlight active page in SIDEBAR
    var currLocation = window.location.pathname.slice(1);
    if (alias[currLocation]) currLocation = alias[currLocation];
    var activeMenu = document.getElementById(currLocation);
    if (activeMenu !== null) {
        if (isSubmenu(activeMenu)) {
            $(activeMenu.parentElement).collapse('show');
        } else {
            activeMenu.setAttribute('class', 'active');
        }
    }

    // Hightlight active page in NAVBAR
    currLocation = window.location.pathname.slice(1);
    userPagePattern = /^user\//
    if (userPagePattern.test(currLocation)) {
        var activeNav = document.getElementById('user_nav');
        if (activeNav !== null) activeNav.setAttribute('class', 'active');
    } else {
        var activeNav = document.getElementById('index_nav');
        if (activeNav !== null) activeNav.setAttribute('class', 'active');
    }
});
