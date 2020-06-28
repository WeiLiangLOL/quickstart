var alias = {
    '': 'index',
};

function isSubmenu(item) {
    return item.parentElement.classList.contains('collapse');
}

(function sideBarScript() {
    // Collapsible sidebar (on click event)
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Highlight active page in SIDEBAR
    var currLocation = window.location.pathname.slice(1);
    if (alias[currLocation]) currLocation = alias[currLocation];
    // Expand submenu
    var activeMenu = document.getElementById(currLocation);
    if (activeMenu !== null) {
        if (isSubmenu(activeMenu)) {
            $(activeMenu.parentElement).collapse('show');
        } else {
            activeMenu.setAttribute('class', 'active');
        }
    }
})();
