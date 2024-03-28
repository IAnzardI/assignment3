// Define a type for the project
interface Project {
    title: string;
    description: string;
    imageUrl: string;
    altText: string;
}

// Array of additional projects with explicit type
const additionalProjects: Project[] = [
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

// Function to load more projects with type annotations
function loadMoreProjects(): void {
    // Attempt to get the element and assert that it's  an HTMLElement
    let projectContainer = document.getElementById('project-container') as HTMLElement ;

    // Check if projectContainer actually exists before attempting to use it
    if (projectContainer) {
        additionalProjects.forEach((project: Project) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.altText}">
                <div class="project-card-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `;
            // append the projectCard
            projectContainer.appendChild(projectCard);
        });

        // Optionally, hide the Load More button after loading the projects
        let loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Event listener for the Load More button
const loadMoreBtn = document.getElementById('loadMoreBtn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreProjects);
}