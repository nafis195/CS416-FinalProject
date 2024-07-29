// Map.js

// Define the function to draw the US map
function drawUSMap() {
    // Set up margins and dimensions
    const margin = { top: 20, right: 20, bottom: 20, left: 20 },
          width = 960 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Create an SVG container
    const svg = d3.select("#map-container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define path generator
    const path = d3.geoPath();

    // Load and process the map data
    d3.json("https://d3js.org/us-10m.v1.json").then(us => {
        // Define color scale
        const color = d3.scaleQuantize()
            .domain([0, 1000]) // Adjust domain as needed
            .range(d3.schemeBlues[9]);

        // Load and process the dataset
        d3.csv("./Dataset/US_Car_Accident_Dataset.csv").then(data => {
            // Aggregate fatalities by state
            const fatalitiesByState = d3.rollups(
                data,
                v => d3.sum(v, d => +d.Fatalities_in_Crash),
                d => d.State
            );
            
            // Map aggregated data to a lookup
            const dataLookup = new Map(fatalitiesByState.map(([state, totalFatalities]) => [state, { TotalFatalities: totalFatalities }]));

            // Draw the map
            svg.append("g")
                .attr("class", "states")
              .selectAll("path")
              .data(topojson.feature(us, us.objects.states).features)
              .enter().append("path")
                .attr("d", path)
                .attr("fill", d => {
                  const stateData = dataLookup.get(d.id);
                  return stateData ? color(stateData.TotalFatalities) : "#ccc";
                })
                .on("mouseover", function(event, d) {
                  const stateData = dataLookup.get(d.id);
                  tooltip.style("opacity", 1)
                         .html(stateData ? `<strong>${d.properties.name}</strong><br>Total Fatalities: ${stateData.TotalFatalities}` : `<strong>${d.properties.name}</strong><br>No Data Available>`)
                         .style("left", (event.pageX + 10) + "px")
                         .style("top", (event.pageY - 28) + "px");
                })
                .on("mousemove", function(event) {
                  tooltip.style("left", (event.pageX + 10) + "px")
                         .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function() {
                  tooltip.style("opacity", 0);
                });

            // Draw state borders
            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));

            // Create the tooltip
            const tooltip = d3.select("#map-container").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
        });
    });
}

// Expose the drawUSMap function globally
window.drawUSMap = drawUSMap;
