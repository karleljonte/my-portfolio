// Display public repositories on the projects page using the GitHub API.
const githubContainer = document.querySelector("#github-projects");

if (githubContainer) {
    fetch("https://api.github.com/users/karleljonte/repos?sort=updated&per_page=6")
        .then(response => {
            if (!response.ok) throw new Error("GitHub returned an error.");
            return response.json();
        })
        .then(repositories => {
            if (!Array.isArray(repositories) || repositories.length === 0) {
                githubContainer.innerHTML = '<p>No public repositories were found yet. Check back soon.</p>';
                return;
            }

            githubContainer.innerHTML = "";
            repositories.forEach(repo => {
                const card = document.createElement("article");
                card.className = "project-card repo-card";

                const info = document.createElement("div");
                info.className = "project-info";
                const title = document.createElement("h3");
                title.textContent = repo.name;
                const description = document.createElement("p");
                description.textContent = repo.description || "No description has been added to this repository yet.";
                const language = document.createElement("p");
                language.className = "tech-list";
                language.textContent = "Main language: " + (repo.language || "Not specified");
                const link = document.createElement("a");
                link.href = repo.html_url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "View repository ↗";

                info.append(title, description, language, link);
                card.append(info);
                githubContainer.append(card);
            });
        })
        .catch(() => {
            githubContainer.innerHTML = '<p>Repositories could not load right now. You can visit <a href="https://github.com/karleljonte" target="_blank" rel="noopener noreferrer">my GitHub profile</a> instead.</p>';
        });
}

// Filter the portfolio project cards by category.
const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioCards = document.querySelectorAll("#portfolio-projects .project-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        const selectedFilter = button.dataset.filter;

        filterButtons.forEach(item => {
            const selected = item === button;
            item.classList.toggle("active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });

        portfolioCards.forEach(card => {
            const shouldShow = selectedFilter === "all" || card.dataset.category === selectedFilter;
            card.hidden = !shouldShow;
        });
    });
});

// Validate the contact form on the home page.
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.querySelector("#contact-name");
        const email = document.querySelector("#contact-email");
        const message = document.querySelector("#contact-message");
        const status = document.querySelector("#form-status");
        const errors = {
            name: document.querySelector("#name-error"),
            email: document.querySelector("#email-error"),
            message: document.querySelector("#message-error")
        };
        let valid = true;

        Object.values(errors).forEach(error => error.textContent = "");
        status.textContent = "";

        if (name.value.trim().length < 2) {
            errors.name.textContent = "Please enter your name (at least 2 characters).";
            valid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            errors.email.textContent = "Please enter a valid email address.";
            valid = false;
        }

        if (message.value.trim().length < 10) {
            errors.message.textContent = "Please enter a message of at least 10 characters.";
            valid = false;
        }

        if (valid) {
            status.textContent = "Validation successful! This demo form does not send messages yet; use the email link above to contact me.";
            contactForm.reset();
        } else {
            status.textContent = "Please correct the highlighted fields and try again.";
        }
    });
}
