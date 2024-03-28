"use strict";
const additionalProjects = [
    {
        title: "Kids Camp",
        description: "Kids deserve a break and need exercise. We can help parents get a break.",
        imageUrl: "./images/kids.jpg",
        altText: "Kids Camp"
    },
    {
        title: "Movie Day",
        description: "This would be a community event where you can watch movies. We show films collect money for charity and makes sure the whole community has a blast.",
        imageUrl: "./images/watching-movies.png",
        altText: "Movie Day"
    },
];
function loadMoreProjects() {
    let projectContainer = document.getElementById('project-container');
    if (projectContainer) {
        additionalProjects.forEach((project) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.altText}">
                <div class="project-card-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `;
            projectContainer.appendChild(projectCard);
        });
        let loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
}
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreProjects);
}
//# sourceMappingURL=addtionalprojects.js.map