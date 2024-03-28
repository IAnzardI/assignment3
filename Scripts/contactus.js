"use strict";
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('fullName')?.value;
        const contact = document.getElementById('contactNumber')?.value;
        const email = document.getElementById('emailAddress')?.value;
        const message = document.getElementById('message')?.value;
        const checkbox = document.getElementById('subscribeCheckBox')?.checked;
        if (!name || !email || !contact || !message || !checkbox) {
            alert('Please fill out all fields and agree to the subscription.');
            return;
        }
        const modal = document.getElementById("myModal");
        const span = document.getElementsByClassName("close")[0];
        const modalText = document.getElementById("modalText");
        if (modal && modalText && span) {
            let countdown = 5;
            modalText.innerHTML = `Thank you, ${name}.<br>Your message has been sent.<br>Redirecting in <span id="countdown">${countdown}</span> seconds...`;
            modal.style.display = "block";
            let timer = setInterval(() => {
                countdown--;
                const countdownElement = document.getElementById("countdown");
                if (countdownElement) {
                    countdownElement.textContent = countdown.toString();
                }
                if (countdown <= 0) {
                    clearInterval(timer);
                    window.location.href = 'index.html';
                }
            }, 1000);
            span.onclick = () => {
                clearInterval(timer);
                modal.style.display = "none";
                contactForm.reset();
            };
            window.onclick = (event) => {
                if (event.target == modal) {
                    clearInterval(timer);
                    modal.style.display = "none";
                    contactForm.reset();
                }
            };
        }
    });
}
//# sourceMappingURL=contactus.js.map