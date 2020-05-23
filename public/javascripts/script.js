$(document).ready(function () {
    // Collapsible sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
    // Highlight active page in sidebar
    var curr = window.location.pathname.slice(1);
    if (!curr) curr = "index";
    console.log("Current page: " + curr); // debug
    var activeSide = document.getElementById(curr);
    if (activeSide !== null) activeSide.setAttribute('class', 'active');
    // Hightlight active page in navbar
    if (curr !== "login") {
        var activeNav = document.getElementById('index_nav');
        if (activeNav !== null) activeNav.setAttribute('class', 'active');
    }
});