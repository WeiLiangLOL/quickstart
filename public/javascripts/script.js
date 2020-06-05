
var alias = {
    "": "index"
}

var submenu = {
    "features": "#featuresSubmenu",
    
    "userGuide": "#userGuideSubmenu",
    
    "user/formPending": "#formSubmenu",
    "user/formSpecial": "#formSubmenu",
    "user/formHistory": "#formSubmenu",
    "user/formManagement": "#formSubmenu",
    
    "user/group": "#userMgmtSubmenu",
    "user/user" : "#userMgmtSubmenu",
    
    "user/viewMyData": "#dataMgmtSubmenu",
    "user/storage": "#dataMgmtSubmenu",
    "user/analysis": "#dataMgmtSubmenu"
}

$(document).ready(function () {
    // Collapsible sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
    
    // Highlight active page in SIDEBAR
    var curr = window.location.pathname.slice(1);
    if (submenu[curr]) { // Is a submenu, Uncollpase submenu
        $(submenu[curr]).collapse("show");
    } else { // Is not a submenu, set menu as active
        if (alias[curr]) curr = alias[curr];
        var activeMenu = document.getElementById(curr);
        if (activeMenu !== null) activeMenu.setAttribute('class', 'active');
    }
    
    // Hightlight active page in NAVBAR
    if (curr !== "login") {
        var activeNav = document.getElementById('index_nav');
        if (activeNav !== null) activeNav.setAttribute('class', 'active');
    }
});