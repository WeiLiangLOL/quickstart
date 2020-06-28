(function navBarScript() {
    // Hightlight active page in NAVBAR
    var currLocation = window.location.pathname.slice(1);
    userPagePattern = /^(profile|announcement|dashboard|form|storage|admin)/;
    if (userPagePattern.test(currLocation)) {
        var activeNav = document.getElementById('user_nav');
        if (activeNav !== null) activeNav.setAttribute('class', 'active');
    } else {
        var activeNav = document.getElementById('index_nav');
        if (activeNav !== null) activeNav.setAttribute('class', 'active');
    }
})();
