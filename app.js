document.addEventListener("DOMContentLoaded", () => {

    const navigationItems = document.querySelectorAll(".nav-item");
    const dashboardCards = document.querySelectorAll(".dashboard-card");


    /*
     * Navigation
     */

    navigationItems.forEach(item => {

        item.addEventListener("click", () => {

            navigationItems.forEach(nav => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

        });

    });


    /*
     * Dashboard-Kacheln
     */

    dashboardCards.forEach((card, index) => {

        card.addEventListener("click", () => {

            console.log(`Kachel ${index + 1} ausgewählt`);

        });

    });

});