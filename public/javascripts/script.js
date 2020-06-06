var alias = {
    "": "index",
};

function isSubmenu (item) {
	return item.parentElement.classList.contains("collapse");
}

$(document).ready(function () {
    // Collapsible sidebar
    $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
        $(this).toggleClass("active");
    });

    // Highlight active page in SIDEBAR
    var currLocation = window.location.pathname.slice(1);
	if (alias[currLocation]) currLocation = alias[currLocation];
	var activeMenu = document.getElementById(currLocation);
	if (activeMenu !== null) {
		if (isSubmenu(activeMenu)) {
			$(activeMenu.parentElement).collapse("show");
		} else {
			activeMenu.setAttribute('class', 'active');
		}
	}
    
    // Hightlight active page in NAVBAR
	// Login page is incidentally handled by code in sidebar
	// User page is simple enough to be hardcoded
	// Only left the homepage (Home, Features, UserGuide and About pages)
    if (currLocation !== "login") {
        var activeNav = document.getElementById('index_nav');
        if (activeNav !== null) activeNav.setAttribute('class', 'active');
    }
});
