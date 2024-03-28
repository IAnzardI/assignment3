"use strict";
(function () {
    function CheckLogin() {
        if (!sessionStorage.getItem("user")) {
            $("#login").html(`<a id ="logout" class="nav-link" data="#"><i class="fa fa-sign-in-alt"> Logout</i></a>`);
        }
        $("#logout").on("click", function () {
            sessionStorage.clear();
            location.href = "/login";
        });
    }
})();
//# sourceMappingURL=login.js.map