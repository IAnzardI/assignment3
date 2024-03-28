///<reference path="../node_modules/@types/jquery/misc.d.ts"/>
"use strict";

// IIFE = Immediately Invoked Functional Expression
import Contact = core.Contact;

(function () {

/**
 * Bind click, mouseover, and mouseout events to anchor tags with the class "link" and a matching data attribute
 * Applies CSS changes for visual feedback and handles link activation on click
 * @param link
 *
 * */
function AddLinkEvents(link:string):void {

    // find all anchor tags with the class link that also has a data attribute equal to our link arg
    let linkQuery = $(`a.link[data=${link}]`);
    // remove all the link events from event queue
    linkQuery.off("click");
    linkQuery.off("mouseover");
    linkQuery.off("mouseout");

    linkQuery.css("text=decoration", "underline")
    linkQuery.css("color", "blue");

    linkQuery.on("click", function () {
        LoadLink(`${link}`);
    });

    linkQuery.on("mouseover", function () {
        $(this).css("cursor", "pointer");
        $(this).css("font-weight", "bold");
    });

    linkQuery.on("mouseout", function (){
        $(this).css("font-weight", "normal");
    });

}


/**
 * Sets up event listeners for navigation links found within the list items of unordered lists
 * Removes any existing click and mouseover events before adding new ones ot control navigation behaviour
 *
 * **/

function AddNavigationEvents(){
    let navlinks = $("ul>li>a") // find all navigation link

    navlinks.off("click");
    navlinks.off("mouseover");

    // Loop through each navigation link and load the appropriate content on click
    navlinks.on("click", function (){
        LoadLink($(this).attr("data") as string)
    });

    navlinks.on("mouseover", function (){
        $(this).css("cursor", "pointer");
    });
}

/**
 * Updates the applications current active link, manages authentication and updates the browser history
 * It also updates navigation UI to reflect the current active link and load corresponding content.
 * @param link
 * @param data
 *
 * **/

function LoadLink(link:string, data:string = ""): void {

    router.ActiveLink = link;
    AuthGuard();
    router.LinkData = data;
    history.pushState({}, "", router.ActiveLink);

    document.title = capitalizeFirstLetter(router.ActiveLink);
    $("ul>li>a").each(function (){
        $(this).removeClass("active");
    });

    $(`li>a>:contains(${document.title})`).addClass("active");
    LoadContent();
}

function AuthGuard() {
    let protected_routes = ["contact-list"];

    if(protected_routes.indexOf(router.ActiveLink) > -1) {
        if(!sessionStorage.getItem("user")) {
            LoadLink("home");
        }
    }
}


// Function to display the home page content
function DisplayHomePage() {
    // Log a message to indicate that DisplayHomePage is called
    console.log("Called DisplayHomePage()");

    // Select the slideshow container
    const slideshowContainer = document.querySelector(".slideshow-container");

    // Check if the slideshow container exists
    if (slideshowContainer) {
        // Create slides
        const slide1 = createSlide("../../images/harmony1.jpg", "Slide 1");
        const slide2 = createSlide("../../images/harmony2.jpg", "Slide 2");
        const slide3 = createSlide("../../images/harmony3.jpg", "Slide 3");

        // Append slides to the slideshow container
        slideshowContainer.appendChild(slide1);
        slideshowContainer.appendChild(slide2);
        slideshowContainer.appendChild(slide3);

        // Start the slideshow
        showSlides();
    } else {
        console.error("Slideshow container not found.");
    }
}

function createSlide(imageSrc :any, altText : any) {
    // Create slide element
    const slide = document.createElement('div');
    slide.classList.add('mySlides', 'fade');

    // Create image element
    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = altText;

    // Append image to the slide
    slide.appendChild(image);

    return slide;
}
function showSlides() {
    const slides = document.getElementsByClassName('mySlides');

    // Check if there are any slides
    if (slides.length === 0) {
        console.error("No slides found. Make sure your HTML contains elements with the class 'mySlides'.");
        return;
    }

    for (let i = 0; i < slides.length; i++) {
        (slides[i] as HTMLElement).style.display = 'none';
    }

    slideIndex++;

    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    (slides[slideIndex - 1] as HTMLElement).style.display = 'block';
    setTimeout(showSlides, 3000);
}
let slideIndex = 1;
showSlides();


// Function to display the portfolio page content
function DisplayPortfolioPage(){
    console.log("Called DisplayPortfolioPage()");
}
// Function to display the services page content
function DisplayServicesPage(){
    console.log("Called DisplayServicesPage()");
}

function DisplayGalleryPage() {
    console.log("Called DisplayGalleryPage()");
}

// Function to display the team page content
function DisplayTeamPage(){
    console.log("Called DisplayTeamPage()");
}
// Function to display the blog page content
function DisplayBlogPage(): void {
    console.log("Called DisplayBlogPage()");

    let searchBox: HTMLElement | null = document.getElementById('searchBox');

    if (searchBox) {
        searchBox.addEventListener('keyup', searchContent);
    }
}

function searchContent(): void {
    let input: HTMLInputElement | null = document.getElementById('searchBox') as HTMLInputElement;
    let filter: string = input ? input.value.toUpperCase() : '';
    let paragraphs: NodeListOf<HTMLParagraphElement> = document.querySelectorAll('p');

    paragraphs.forEach(p => {
        p.innerHTML = p.textContent || '';
    });

    if (!filter) {
        return;
    }

    paragraphs.forEach(element => {
        let innerHTML: string = element.textContent || '';
        let index: number = innerHTML.toUpperCase().indexOf(filter);
        if (index >= 0) {
            innerHTML = `${innerHTML.substring(0, index)}<span class='highlight'>${innerHTML.substring(index, index + filter.length)}</span>${innerHTML.substring(index + filter.length)}`;
            element.innerHTML = innerHTML;
        }
    });
}

// Function called to display the events page
function DisplayEventsPage() {
    console.log("Called DisplayEventsPage()");

    // Calls a function to fetch and display news
    fetchNews()
    $(document).ready(function() {
        //AJAX request to fetch event data from a events JSON file
        $.get({
            url: './data/events.json',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                // On success, calls a function to display the events
                displayEvents({events: data.events});
            },
            // When there is an error displays an error message
            error: function() {
                $('#events-list').html('<p>Events could not be loaded.</p>');
            }
        });
    });
}

// Function to display event data on the page
function displayEvents({events}: { events: any }) {

    let eventsHtml = '';
    events.forEach(function(event: any) {
        eventsHtml += `<div class="event">
    <h2>${event.name}</h2>
    <p><strong>Date:</strong> ${event.date}</p>
    <p><strong>Location:</strong> ${event.location}</p>
    <p>${event.description}</p>
</div>`;
    });
    //HTML content into the events list container
    $('#events-list').html(eventsHtml);
}

// Function to fetch news data from an API
function fetchNews() {

    // API key and URL setup for the news API
    let apiKey = '3bb9d2ddcb064382b70b5495ba20a488';
    let url = `https://newsapi.org/v2/top-headlines/sources?country=ca&apiKey=${apiKey}`;

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        // Checks if the request was successful
        if (xhr.status >= 200 && xhr.status < 300) {
            let response = JSON.parse(xhr.responseText);
            if (response.status === "ok") {
                displayNews({data: response});
            } else {
                console.error("The request failed");
                $("#news-container").html(`<p>Failed to retrieve news data: ${response.message}</p>`);
            }
        } else {
            console.error("The request failed");
            $("#news-container").html(`<p>Failed to retrieve data</p>`);
        }
    };
    //Sends the request
    xhr.send();
}

// Function to display news data on the page
function displayNews({data}: { data: any }) {
    let newsContainer = $("#news-container");
    let htmlContent = `<h2>News Sources</h2>`;
    data.sources.forEach(function (source: any) {
        //appends its details to 'htmlContent'
        htmlContent += `<p><a data="${source.url}" target="_blank">${source.name}</a>: ${source.description}</p>`;
    });
    // Inserts the content into the news container
    newsContainer.html(htmlContent);
}

// Function called to display the statistics page
function DisplayStatisticsPage(): void {
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

function createChart(elementId: string, label: string, data: any, type: string): void {
    let ctx: CanvasRenderingContext2D | null = (document.getElementById(elementId) as HTMLCanvasElement).getContext('2d');

    if (!ctx) {
        return;
    }

    const chartColors: string[] = ['#FF6384', '#36A2EB', '#FFCE56', '#cc65fe', '#ff9f40', '#4bc0c0', '#9966ff', '#ff6384', '#36a2eb', '#ccff66'];

    let backgroundColors: string | string[] = type === 'pie' || type === 'doughnut' ? chartColors : 'rgba(255, 99, 132, 0.2)';
    let borderColors: string | string[] = type === 'pie' || type === 'doughnut' ? chartColors : 'rgba(255, 99, 132, 1)';

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

// Function called to display the events planning page
function DisplayEventPlanningPage(): void {
    console.log("DisplayEventPlanningPage()");
}

// Runs on login page
function DisplayLoginPage() {

    console.log("Called DisplayLoginPage()");

    let messageArea:JQuery<HTMLElement> = $("#messageArea");
    messageArea.hide();

    AddLinkEvents("register");

    $("#loginButton").on("click", function ():void{

        let success = false;
        let newUser = new core.User();

        $.get("./data/users.json", function (data):void{

            for(const user of data.users){
                // Our request successful
                console.log(data.user);

                let username:string = document.forms[0].username.value;
                let password:string = document.forms[0].password.value;

                if(username === user.Username && password === user.Password){

                    newUser.fromJSON(user);
                    success = true;
                    break;
                }
            }
            if(success) {
                sessionStorage.setItem("user", newUser.serialize() as string);
                messageArea.removeAttr("class").hide();
                LoadLink("contact-list");
            } else{
                $("#user").trigger("focus").trigger("select");
                messageArea.addClass("alert alert-danger").text("ERROR: Invalid Credentials").show();
            }

            $("#cancelButton").on("click",function (){
                document.forms[0].reset();
                LoadLink("home");
            });
        });
    });
}

// This is to check if the user is logged in.
function CheckLogin(){
    if(sessionStorage.getItem("user")) {
        $("#login").html('<a id="logout" class="nav-link" data="#"><i class="fas fa-sign-out-alt"> Logout</i></a>')
        let statisticsLink: HTMLElement | null = document.getElementById('statisticsLink');
        if (statisticsLink) {
            statisticsLink.removeAttribute('style');
        }

        let eventPlanningLink: HTMLElement | null = document.getElementById('eventPlanningLink');
        if (eventPlanningLink) {
            eventPlanningLink.removeAttribute('style');
        }

    }

    $("#logout").on("click", function () {
        sessionStorage.clear();

        $("#login").html(`<a class="nav-link" data="login"><i class="fas fa-sign-out-alt"> Login</i></a>`)

        AddNavigationEvents();

        LoadLink("login");

    });
}

function ActiveLinkCallback() :Function {
    console.log("router.ActiveLink: " + router.ActiveLink);
    switch(router.ActiveLink){
        case "home" : return DisplayHomePage;
        case "portfolio": return DisplayPortfolioPage;
        case "services": return DisplayServicesPage;
        case "gallery": return DisplayGalleryPage;
        case "team": return DisplayTeamPage;
        case "blog": return DisplayBlogPage;
        case "events": return DisplayEventsPage;
        case "login" : return DisplayLoginPage;
        case "register" : return DisplayRegisterPage;
        case "Terms-of-Service" : return DisplayTermsofServicesPage;
        case "Privacy-Policy" : return DisplayPrivacyPolicyPage;
        case "contact" : return DisplayContactPage;
        case "contact-list" : return DisplayContactListPage;
        case "edit" : return DisplayEditPage;
        case "statistics" : return DisplayStatisticsPage;
        case "Event-Planning" : return DisplayEventPlanningPage;
        case "404" : return Display404Page;

        default:
            console.error("ERROR: callback does not exist " + router.ActiveLink);
            return new Function();
    }
}

function capitalizeFirstLetter(str:string){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// This is a load header
function LoadHeader() {

    $.get("/views/components/header.html", function(html_data):void
    {
        $("header").html(html_data);
        document.title = capitalizeFirstLetter(router.ActiveLink);

        $(`li > a:contains(${document.title})`).addClass("active").attr("aria-current", "page");

        AddNavigationEvents();
        CheckLogin();
    });
}

function LoadContent(){

    let page_name:string = router.ActiveLink;
    let callback = ActiveLinkCallback();

    $.get(`/views/content/${page_name}.html`, function (html_data):void {
        $("main").html(html_data);

        CheckLogin();
        callback();
    });
}

function LoadFooter(){
    $.get("/views/components/footer.html", function (html_data):void{
        $("footer").html(html_data);
        AddNavigationEvents();
    });

}

// Uses regex to validate what can be allowed on the text space and passes in the input_field_id, regular_expression, error_message
function RegisterFormValidation() {
    // fullName
    ValidateField("#fullName", /^([A-Z][a-zA-Z'’-]+)(\s[A-Z][a-zA-Z'’-]*)*(\s[A-Z][a-zA-Z'’-]+)$/, "Please Enter a Valid Full Name");


    //contactNumber
    ValidateField("#contactNumber", /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/, "Please Enter a Valid Contact Number");

    //emailAddress
    ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, "Please Enter a Email Address");

    //Validate Address
    ValidateField("#address",/^[a-zA-Z0-9\s.'-]{2,}$/, "Please enter a valid address");

    //Validate Password 6 characters only
    ValidateField("#password",/^.{6}$/, "Please enter a valid password.");

    //Validate Username 8 characters only
    ValidateField("#userName",/^[a-zA-Z0-9]{8}$/, "Please enter a valid username");
}


/**
 * validate form field
 * @param {string} input_field_id
 * @param {RegExp} regular_expression
 * @param {string} error_message
 * @constructor
 **/
function ValidateField(input_field_id:string, regular_expression:RegExp, error_message:string) {
    let messageArea = $("#messageArea").hide() as JQuery<HTMLElement>;

    $(input_field_id).on("blur", function () {
        let inputFieldText = $(this).val() as string;
        if (!regular_expression.test(inputFieldText)) {
            // full name does not pass pattern matching
            $(this).trigger("focus").trigger("select");
            messageArea.addClass("alert alert-danger").text(error_message).show();
        } else {
            // full name is successful
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

// Display the register page, console fo errors
function DisplayRegisterPage() {
    console.log("Called DisplayRegisterPage()");
    // This function to validate registration
    AddLinkEvents("login");
    RegisterFormValidation();
}

function Display404Page() {
    console.log("Called Display404Page()");
}


/**
 *
 * @param {string} fullName
 * @param {int} contactNumber
 * @param {string} emailAddress
 * @constructor
 */
function AddContact(fullName:string, contactNumber:string, emailAddress:string):void {
    let contact: Contact = new core.Contact(fullName, contactNumber, emailAddress);
    if(contact.serialize()){
        let key: string = contact.fullName.substring(0, 1) + Date.now();
        localStorage.setItem(key, contact.serialize() as string);
    }
}

function DisplayContactListPage(){
    console.log("Called DisplayContactListPage()");

    if(localStorage.length > 0){
        let contactList = document.getElementById("contactList") as HTMLElement;
        let data = "";
        let keys = Object.keys(localStorage);

        let index = 1;
        for(const key of keys) {
            let contact = new core.Contact();
            let contactData = localStorage.getItem(key);

            contact.deserialize(contactData as string);
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

    $("#addButton").on("click",  () => {
        LoadLink("edit", "add");

    });

    $("button.delete").on("click", function() {
        if(confirm("Please confirm contact deletion?")){
            localStorage.removeItem($(this).val() as string)
        }
        LoadLink("contact-list");
    });


    $("button.edit").on("click", function () {
        LoadLink("edit", $(this).val() as string)
    });

}

function DisplayEditPage() {
    console.log("Called DisplayEditPage()....");

    RegisterFormValidation();

    let page:string = location.hash.substring(1);

    switch(page){
        case "add":

            $("main>h1").text("Add Contact");
            $("#addButton").html(`<i class="fas fa-plus-circle fa-sm" /> Add`);

            $("#editButton").on("click",   (event: Event) => {
                event.preventDefault();

                let fullName:string = document.forms[0].fullName.value;
                let contactNumber:string = document.forms[0].contactNumber.value;
                let emailAddress:string = document.forms[0].emailAddress.value;

                AddContact(fullName, contactNumber, emailAddress);
                LoadLink("contact-list");
            });

            $("#cancelButton").on("click",  () =>  {
                LoadLink("contact-list");
            });

            break;
        default: {

            let contact: Contact = new core.Contact();
            contact.deserialize(localStorage.getItem(page) as string)

            $("#fullName").val(contact.fullName);
            $("#contactNumber").val(contact.contactNumber);
            $("#emailAddress").val(contact.emailAddress);


            $(`#editButton`).on("click",   (event: Event) => {
                event.preventDefault();

                contact.fullName = $("#fullName").val() as string;
                contact.contactNumber = $("#contactNumber").val() as string;
                contact.emailAddress = $("#emailAddress").val() as string;

                localStorage.setItem(page, contact.serialize() as string);
                LoadLink("contact-list");

            });

            $(`#cancelButton`).on("click", () => {
                LoadLink("contact-list");
            });
        }
            break;
    }
}

function DisplayContactPage(){
    console.log("Called DisplayContactPage()");

    $("a[data='contact-list']").off("click");
    $("a[data='contact-list']").on("click", function (){
        LoadLink("contact-list");
    });

    RegisterFormValidation();


    let sendButton = document.getElementById("sendButton") as HTMLElement;
    let subscribeButton = document.getElementById("subscribeCheckBox") as HTMLInputElement;

    sendButton.addEventListener("click", function(){
        if(subscribeButton.checked){

            let fullName:string = document.forms[0].fullName.value;
            let contactNumber:string = document.forms[0].contactNumber.value;
            let emailAddress:string = document.forms[0].emailAddress.value;

            AddContact(fullName, contactNumber, emailAddress);
        }
    });
}

// Function to start the application based on the page title
function Start(){
    console.log("App Started");
    LoadHeader();

    LoadLink("home");

    LoadFooter();
}

    window.addEventListener("load", Start);
})();


