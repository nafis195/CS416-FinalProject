// BubbleChart.js
function drawBubbleChart() {
    // Remove any existing SVG elements
    d3.select("#bubble-chart-container").select("svg").remove();
    d3.select("#bubble-chart-container").select(".tooltip").remove();

    // Set the dimensions and margins of the graph
    const margin = { top: 40, right: 20, bottom: 120, left: 50 },  // Increased bottom margin
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#bubble-chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Read the data
    d3.csv("./Dataset/US_Car_Accident_Dataset.csv").then(function (data) {
        // Aggregate data by Injury_Severity
        const severityData = d3.rollups(
            data,
            v => v.length,
            d => d.Injury_Severity
        ).map(([key, value]) => ({ severity: key, count: value }));

        // Define scales
        const x = d3.scaleBand()
            .domain(severityData.map(d => d.severity))
            .range([0, width])
            .padding(1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(severityData, d => d.count)])
            .nice()
            .range([height, 0]);

        const z = d3.scaleLinear()
            .domain([0, d3.max(severityData, d => d.count)])
            .range([4, 40]);

        // Add X axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,10)rotate(-45)")  // Adjusted rotation
            .style("text-anchor", "end");

        // Add Y axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // Create a tooltip div that is hidden by default
        const tooltip = d3.select("#bubble-chart-container")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            .style("position", "absolute");

        // Functions to show, update, and hide the tooltip
        const showTooltip = function (event, d) {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip
                .html("Injury Severity: " + d.severity + "<br>Total: " + d.count)
                .style("left", (event.pageX + 30) + "px")
                .style("top", (event.pageY + 30) + "px");
        };

        const moveTooltip = function (event, d) {
            tooltip
                .style("left", (event.pageX + 30) + "px")
                .style("top", (event.pageY + 30) + "px");
        };

        const hideTooltip = function (event, d) {
            tooltip.transition().duration(200).style("opacity", 0);
        };

        // Add dots
        svg.append('g')
            .selectAll("circle")
            .data(severityData)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.severity))
            .attr("cy", d => y(d.count))
            .attr("r", d => z(d.count))
            .style("fill", "#69b3a2")
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip);
    });
}

// Call the function to draw the bubble chart
drawBubbleChart();
