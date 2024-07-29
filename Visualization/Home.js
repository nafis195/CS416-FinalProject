// Home.js
document.addEventListener("DOMContentLoaded", function() {
    const container = d3.select("#home-container");

    container.append("h1")
        .text("Welcome to the US Car Accident Data Visualization Project");

    container.append("p")
        .text("This project provides interactive visualizations of US car accident data using D3.js. Explore various charts to understand the patterns and trends in car accidents across the United States in 2011.");

    container.append("h2")
        .text("Features");

    container.append("ul")
        .selectAll("li")
        .data([
            "Bar Plot: Compare the number of accidents by different categories.",
            "Bubble Chart: Analyze the distribution of injury severity.",
            // "US Map: See the total fatalities in each state.",
            "Annotations: Gain insights with highlighted data points.",
            "Interactive Chart: Visualize fatalities by month and gender."
        ])
        .enter()
        .append("li")
        .text(d => d);

    container.append("h2")
        .text("About the Data");

    container.append("p")
        .text("The data used in this project is sourced from the US Car Accident Dataset. It includes information on accidents, such as the date, location, severity, and number of fatalities. This project aims to provide meaningful insights through visualizations.");

    container.append("h2")
        .text("How to Navigate");

    container.append("p")
        .text("Use the navigation buttons at the top to switch between different visualizations. Each visualization provides a unique perspective on the car accident data. Hover over data points to see detailed information in tooltips.");

    container.append("h2")
        .text("Contact");

    container.append("p")
        .text("For any questions or feedback, please contact us at nchowd21@illinois.edu.");

    container.append("footer")
        .text("© 2024 US Car Accident Data Visualization Project. All rights reserved.");
});
