"use strict";

// Ensure elements exist and are of expected types
const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;

if (contactForm) {
    contactForm.addEventListener('submit', (event: Event) => {
        event.preventDefault();

        // Obtain form values with type assertions
        const name = (document.getElementById('fullName') as HTMLInputElement | null)?.value;
        const contact = (document.getElementById('contactNumber') as HTMLInputElement | null)?.value;
        const email = (document.getElementById('emailAddress') as HTMLInputElement | null)?.value;
        const message = (document.getElementById('message') as HTMLInputElement | null)?.value;
        const checkbox = (document.getElementById('subscribeCheckBox') as HTMLInputElement | null)?.checked;

        // Check for null values and show an alert if any field is missing
        if (!name || !email || !contact || !message || !checkbox) {
            alert('Please fill out all fields and agree to the subscription.');
            return;
        }

        // Handle modal display and countdown
        const modal = document.getElementById("myModal") as HTMLElement | null;
        const span = document.getElementsByClassName("close")[0] as HTMLElement | null;
        const modalText = document.getElementById("modalText") as HTMLElement | null;

        if (modal && modalText && span) {
            let countdown = 5;
            modalText.innerHTML = `Thank you, ${name}.<br>Your message has been sent.<br>Redirecting in <span id="countdown">${countdown}</span> seconds...`;
            modal.style.display = "block";

            // Countdown logic
            let timer = setInterval(() => {
                countdown--;
                const countdownElement = document.getElementById("countdown") as HTMLElement | null;
                if (countdownElement) {
                    countdownElement.textContent = countdown.toString();
                }
                if (countdown <= 0) {
                    clearInterval(timer);
                    window.location.href = 'index.html'; // Redirect to home page
                }
            }, 1000);

            // Close modal logic
            span.onclick = () => {
                clearInterval(timer);
                modal.style.display = "none";
                contactForm.reset();
            };

            window.onclick = (event: MouseEvent) => {
                if (event.target == modal) {
                    clearInterval(timer);
                    modal.style.display = "none";
                    contactForm.reset();
                }
            };
        }
    });
}