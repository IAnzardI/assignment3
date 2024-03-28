"use strict";
var Contact = core.Contact;
(function () {
    function AddLinkEvents(link) {
        let linkQuery = $(`a.link[data=${link}]`);
        linkQuery.off("click");
        linkQuery.off("mouseover");
        linkQuery.off("mouseout");
        linkQuery.css("text=decoration", "underline");
        linkQuery.css("color", "blue");
        linkQuery.on("click", function () {
            LoadLink(`${link}`);
        });
        linkQuery.on("mouseover", function () {
            $(this).css("cursor", "pointer");
            $(this).css("font-weight", "bold");
        });
        linkQuery.on("mouseout", function () {
            $(this).css("font-weight", "normal");
        });
    }
    function AddNavigationEvents() {
        let navlinks = $("ul>li>a");
        navlinks.off("click");
        navlinks.off("mouseover");
        navlinks.on("click", function () {
            LoadLink($(this).attr("data"));
        });
        navlinks.on("mouseover", function () {
            $(this).css("cursor", "pointer");
        });
    }
    function LoadLink(link, data = "") {
        router.ActiveLink = link;
        AuthGuard();
        router.LinkData = data;
        history.pushState({}, "", router.ActiveLink);
        document.title = capitalizeFirstLetter(router.ActiveLink);
        $("ul>li>a").each(function () {
            $(this).removeClass("active");
        });
        $(`li>a>:contains(${document.title})`).addClass("active");
        LoadContent();
    }
    function AuthGuard() {
        let protected_routes = ["contact-list"];
        if (protected_routes.indexOf(router.ActiveLink) > -1) {
            if (!sessionStorage.getItem("user")) {
                LoadLink("home");
            }
        }
    }
    function DisplayHomePage() {
        console.log("Called DisplayHomePage()");
        const slideshowContainer = document.querySelector(".slideshow-container");
        if (slideshowContainer) {
            const slide1 = createSlide("../../images/harmony1.jpg", "Slide 1");
            const slide2 = createSlide("../../images/harmony2.jpg", "Slide 2");
            const slide3 = createSlide("../../images/harmony3.jpg", "Slide 3");
            slideshowContainer.appendChild(slide1);
            slideshowContainer.appendChild(slide2);
            slideshowContainer.appendChild(slide3);
            showSlides();
        }
        else {
            console.error("Slideshow container not found.");
        }
    }
    function createSlide(imageSrc, altText) {
        const slide = document.createElement('div');
        slide.classList.add('mySlides', 'fade');
        const image = document.createElement('img');
        image.src = imageSrc;
        image.alt = altText;
        slide.appendChild(image);
        return slide;
    }
    function showSlides() {
        const slides = document.getElementsByClassName('mySlides');
        if (slides.length === 0) {
            console.error("No slides found. Make sure your HTML contains elements with the class 'mySlides'.");
            return;
        }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        slideIndex++;
        if (slideIndex > slides.length) {
            slideIndex = 1;
        }
        slides[slideIndex - 1].style.display = 'block';
        setTimeout(showSlides, 3000);
    }
    let slideIndex = 1;
    showSlides();
    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage()");
    }
    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage()");
    }
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage()");
    }
    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage()");
    }
    function DisplayBlogPage() {
        console.log("Called DisplayBlogPage()");
        let searchBox = document.getElementById('searchBox');
        if (searchBox) {
            searchBox.addEventListener('keyup', searchContent);
        }
    }
    window.addEventListener("load", Start);
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage()");
        let messageArea = $("#messageArea");
        messageArea.hide();
        AddLinkEvents("register");
        $("#loginButton").on("click", function () {
            let success = false;
            let newUser = new core.User();
            $.get("./data/users.json", function (data) {
                for (const user of data.users) {
                    console.log(data.user);
                    let username = document.forms[0].username.value;
                    let password = document.forms[0].password.value;
                    if (username === user.Username && password === user.Password) {
                        newUser.fromJSON(user);
                        success = true;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", newUser.serialize());
                    messageArea.removeAttr("class").hide();
                    LoadLink("contact-list");
                }
                else {
                    $("#user").trigger("focus").trigger("select");
                    messageArea.addClass("alert alert-danger").text("ERROR: Invalid Credentials").show();
                }
                $("#cancelButton").on("click", function () {
                    document.forms[0].reset();
                    LoadLink("home");
                });
            });
        });
    }
    function CheckLogin() {
        if (sessionStorage.getItem("user")) {
            $("#login").html('<a id="logout" class="nav-link" data="#"><i class="fas fa-sign-out-alt"> Logout</i></a>');
            let statisticsLink = document.getElementById('statisticsLink');
            if (statisticsLink) {
                statisticsLink.removeAttribute('style');
            }
            let eventPlanningLink = document.getElementById('eventPlanningLink');
            if (eventPlanningLink) {
                eventPlanningLink.removeAttribute('style');
            }
        }
        $("#logout").on("click", function () {
            sessionStorage.clear();
            $("#login").html(`<a class="nav-link" data="login"><i class="fas fa-sign-out-alt"> Login</i></a>`);
            AddNavigationEvents();
            LoadLink("login");
        });
    }
    function ActiveLinkCallback() {
        console.log("router.ActiveLink: " + router.ActiveLink);
        switch (router.ActiveLink) {
            case "home": return DisplayHomePage;
            case "portfolio": return DisplayPortfolioPage;
            case "services": return DisplayServicesPage;
            case "gallery":
                console.log("Displaying Gallery Page");
                return DisplayGalleryPage;
            case "team": return DisplayTeamPage;
            case "blog": return DisplayBlogPage;
            case "events": return DisplayEventsPage;
            case "login": return DisplayLoginPage;
            case "register": return DisplayRegisterPage;
            case "Terms-of-Service": return DisplayTermsofServicesPage;
            case "Privacy-Policy": return DisplayPrivacyPolicyPage;
            case "contact": return DisplayContactPage;
            case "contact-list": return DisplayContactListPage;
            case "edit": return DisplayEditPage;
            case "statistics": return DisplayStatisticsPage;
            case "Event-Planning": return DisplayEventPlanningPage;
            case "404": return Display404Page;
            default:
                console.error("ERROR: callback does not exist " + router.ActiveLink);
                return new Function();
        }
    }
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function LoadHeader() {
        $.get("/views/components/header.html", function (html_data) {
            $("header").html(html_data);
            document.title = capitalizeFirstLetter(router.ActiveLink);
            $(`li > a:contains(${document.title})`).addClass("active").attr("aria-current", "page");
            AddNavigationEvents();
            CheckLogin();
        });
    }
    function LoadContent() {
        let page_name = router.ActiveLink;
        let callback = ActiveLinkCallback();
        $.get(`/views/content/${page_name}.html`, function (html_data) {
            $("main").html(html_data);
            CheckLogin();
            callback();
        });
    }
    function LoadFooter() {
        $.get("/views/components/footer.html", function (html_data) {
            $("footer").html(html_data);
            AddNavigationEvents();
        });
    }
    function RegisterFormValidation() {
        ValidateField("#fullName", /^([A-Z][a-zA-Z'’-]+)(\s[A-Z][a-zA-Z'’-]*)*(\s[A-Z][a-zA-Z'’-]+)$/, "Please Enter a Valid Full Name");
        ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please Enter a Valid Contact Number");
        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please Enter a Email Address");
        ValidateField("#address", /^[a-zA-Z0-9\s.'-]{2,}$/, "Please enter a valid address");
        ValidateField("#password", /^.{6}$/, "Please enter a valid password.");
        ValidateField("#userName", /^[a-zA-Z0-9]{8}$/, "Please enter a valid username");
    }
    function ValidateField(input_field_id, regular_expression, error_message) {
        let messageArea = $("#messageArea").hide();
        $(input_field_id).on("blur", function () {
            let inputFieldText = $(this).val();
            if (!regular_expression.test(inputFieldText)) {
                $(this).trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else {
                messageArea.removeAttr("class").hide();
            }
        });
    }
    function DisplayPrivacyPolicyPage() {
        console.log("Called DisplayPrivacyPolicyPage()");
    }
    function DisplayTermsofServicesPage() {
        console.log("Called DisplayTermsofServicesPage()");
    }
    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage()");
        AddLinkEvents("login");
        RegisterFormValidation();
    }
    function Display404Page() {
        console.log("Called Display404Page()");
    }
    function DisplayEventsPage() {
        console.log("Called DisplayEventsPage()");
        fetchNews();
        $(document).ready(function () {
            $.get({
                url: './data/events.json',
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    displayEvents({ events: data.events });
                },
                error: function () {
                    $('#events-list').html('<p>Events could not be loaded.</p>');
                }
            });
        });
    }
    function displayEvents({ events }) {
        let eventsHtml = '';
        events.forEach(function (event) {
            eventsHtml += `<div class="event">
        <h2>${event.name}</h2>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Location:</strong> ${event.location}</p>
        <p>${event.description}</p>
    </div>`;
        });
        $('#events-list').html(eventsHtml);
    }
    function fetchNews() {
        let apiKey = '3bb9d2ddcb064382b70b5495ba20a488';
        let url = `https://newsapi.org/v2/top-headlines/sources?country=ca&apiKey=${apiKey}`;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                let response = JSON.parse(xhr.responseText);
                if (response.status === "ok") {
                    displayNews({ data: response });
                }
                else {
                    console.error("The request failed");
                    $("#news-container").html(`<p>Failed to retrieve news data: ${response.message}</p>`);
                }
            }
            else {
                console.error("The request failed");
                $("#news-container").html(`<p>Failed to retrieve data</p>`);
            }
        };
        xhr.send();
    }
    function displayNews({ data }) {
        let newsContainer = $("#news-container");
        let htmlContent = `<h2>News Sources</h2>`;
        data.sources.forEach(function (source) {
            htmlContent += `<p><a data="${source.url}" target="_blank">${source.name}</a>: ${source.description}</p>`;
        });
        newsContainer.html(htmlContent);
    }
    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
        }
    }
    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage()");
        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);
            let index = 1;
            for (const key of keys) {
                let contact = new core.Contact();
                let contactData = localStorage.getItem(key);
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                        <td>${contact.fullName}</td>
                        <td>${contact.contactNumber}</td>
                        <td>${contact.emailAddress}</td>
                        <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                                <i class="fas fa-edit fa-sm"> Edit</i>
                            </button>  
                        </td>
                        <td>
                            <button value="${key}" class="btn btn-danger btn-sm delete">
                                <i class="fas fa-edit fa-sm"> Delete</i>
                            </button> 
                        </td>
                      </tr>`;
                index++;
            }
            contactList.innerHTML = data;
        }
        $("#addButton").on("click", () => {
            LoadLink("edit", "add");
        });
        $("button.delete").on("click", function () {
            if (confirm("Please confirm contact deletion?")) {
                localStorage.removeItem($(this).val());
            }
            LoadLink("contact-list");
        });
        $("button.edit").on("click", function () {
            LoadLink("edit", $(this).val());
        });
    }
    function DisplayEditPage() {
        console.log("Called DisplayEditPage()....");
        RegisterFormValidation();
        let page = location.hash.substring(1);
        switch (page) {
            case "add":
                $("main>h1").text("Add Contact");
                $("#addButton").html(`<i class="fas fa-plus-circle fa-sm" /> Add`);
                $("#editButton").on("click", (event) => {
                    event.preventDefault();
                    let fullName = document.forms[0].fullName.value;
                    let contactNumber = document.forms[0].contactNumber.value;
                    let emailAddress = document.forms[0].emailAddress.value;
                    AddContact(fullName, contactNumber, emailAddress);
                    LoadLink("contact-list");
                });
                $("#cancelButton").on("click", () => {
                    LoadLink("contact-list");
                });
                break;
            default:
                {
                    let contact = new core.Contact();
                    contact.deserialize(localStorage.getItem(page));
                    $("#fullName").val(contact.fullName);
                    $("#contactNumber").val(contact.contactNumber);
                    $("#emailAddress").val(contact.emailAddress);
                    $(`#editButton`).on("click", (event) => {
                        event.preventDefault();
                        contact.fullName = $("#fullName").val();
                        contact.contactNumber = $("#contactNumber").val();
                        contact.emailAddress = $("#emailAddress").val();
                        localStorage.setItem(page, contact.serialize());
                        LoadLink("contact-list");
                    });
                    $(`#cancelButton`).on("click", () => {
                        LoadLink("contact-list");
                    });
                }
                break;
        }
    }
    function DisplayContactPage() {
        console.log("Called DisplayContactPage()");
        $("a[data='contact-list']").off("click");
        $("a[data='contact-list']").on("click", function () {
            LoadLink("contact-list");
        });
        RegisterFormValidation();
        let sendButton = document.getElementById("sendButton");
        let subscribeButton = document.getElementById("subscribeCheckBox");
        sendButton.addEventListener("click", function () {
            if (subscribeButton.checked) {
                let fullName = document.forms[0].fullName.value;
                let contactNumber = document.forms[0].contactNumber.value;
                let emailAddress = document.forms[0].emailAddress.value;
                AddContact(fullName, contactNumber, emailAddress);
            }
        });
    }
    function searchContent() {
        let input = document.getElementById('searchBox');
        let filter = input ? input.value.toUpperCase() : '';
        let paragraphs = document.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.innerHTML = p.textContent || '';
        });
        if (!filter) {
            return;
        }
        paragraphs.forEach(element => {
            let innerHTML = element.textContent || '';
            let index = innerHTML.toUpperCase().indexOf(filter);
            if (index >= 0) {
                innerHTML = `${innerHTML.substring(0, index)}<span class='highlight'>${innerHTML.substring(index, index + filter.length)}</span>${innerHTML.substring(index + filter.length)}`;
                element.innerHTML = innerHTML;
            }
        });
    }
    function DisplayStatisticsPage() {
        console.log("DisplayStatisticsPage()");
        fetch('./data/analytics.json')
            .then(response => response.json())
            .then(data => {
            createChart('monthlyVisitsChart', 'Monthly Visits', data.monthlyVisits, 'bar');
            createChart('pageViewsChart', 'Page Views', data.pageViews, 'bar');
            createChart('topCountriesChart', 'Top Countries', data.topCountries, 'pie');
            createChart('userDemographicsChart', 'User Demographics', data.userDemographics, 'bar');
            createChart('deviceTypesChart', 'Device Types', data.deviceTypes, 'doughnut');
        })
            .catch(error => console.error('Error loading the JSON data: ', error));
    }
    function createChart(elementId, label, data, type) {
        let ctx = document.getElementById(elementId).getContext('2d');
        if (!ctx) {
            return;
        }
        const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#cc65fe', '#ff9f40', '#4bc0c0', '#9966ff', '#ff6384', '#36a2eb', '#ccff66'];
        let backgroundColors = type === 'pie' || type === 'doughnut' ? chartColors : 'rgba(255, 99, 132, 0.2)';
        let borderColors = type === 'pie' || type === 'doughnut' ? chartColors : 'rgba(255, 99, 132, 1)';
        const chartData = {
            labels: data.labels,
            datasets: [{
                    label: label,
                    data: data.values,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
        };
        const chartOptions = {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: label
                }
            }
        };
        new Chart(ctx, {
            type: type,
            data: chartData,
            options: chartOptions
        });
    }
    function DisplayEventPlanningPage() {
        console.log("DisplayEventPlanningPage()");
    }
    function Start() {
        console.log("App Started");
        LoadHeader();
        LoadLink("home");
        LoadFooter();
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map