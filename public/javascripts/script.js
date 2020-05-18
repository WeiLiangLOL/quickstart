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
    var active = document.getElementById(curr);
    active.setAttribute('class', 'active');
    
    
});