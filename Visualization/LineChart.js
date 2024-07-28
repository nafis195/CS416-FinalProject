function drawLineChart() {
    // Remove any existing SVG element to avoid duplication
    d3.select("#line-chart-container").select("svg").remove();

    // Set the dimensions and margins of the graph
    var margin = { top: 10, right: 100, bottom: 50, left: 50 },
        width = 960 - margin.left - margin.right, // Increased width
        height = 400 - margin.top - margin.bottom;

    // Append the svg object to the line chart container
    var svg = d3.select("#line-chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Read the data
    d3.csv("./Dataset/US_Car_Accident_Dataset.csv").then(data => {
        // Parse the date and convert numerical values
        data.forEach(d => {
            d.Crash_Date = new Date(d.Crash_Date);
            d.Fatalities_in_Crash = +d.Fatalities_in_Crash;
        });

        // List of groups (here we have one group per column)
        var allGroups = ["Male", "Female", "Not Reported", "Unknown"];

        // Reformat the data: we need an array of arrays of {x, y} tuples
        var dataReady = allGroups.map(function (grpName) {
            return {
                name: grpName,
                values: d3.rollups(
                    data.filter(d => d.Gender === grpName),
                    v => d3.sum(v, d => d.Fatalities_in_Crash),
                    d => d3.timeMonth(d.Crash_Date)
                ).map(([date, value]) => ({ date, value }))
            };
        });

        // A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
            .domain(allGroups)
            .range(d3.schemeSet2);

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Crash_Date))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(d3.timeFormat("%b")));

        // Add Y axiswith padding to ensure lines stay within bounds
        var y = d3.scaleLinear()
            .domain([0, d3.max(dataReady.flatMap(d => d.values), d => d.value) * 1.1]) // Added padding to the domain
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the lines
        var line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.value));
        svg.selectAll("myLines")
            .data(dataReady)
            .enter()
            .append("path")
            .attr("class", d => d.name.replace(" ", "_"))
           // .attr("d", d => line(d.values.reverse())) // Reverse the data points
            .attr("stroke", d => myColor(d.name))
            .style("stroke-width", 2) // Reduced stroke-width for better visibility
            .style("fill", "none");

        // Add the points
        svg.selectAll("myDots")
            .data(dataReady)
            .enter()
            .append('g')
            .style("fill", d => myColor(d.name))
            .attr("class", d => d.name.replace(" ", "_"))
            .selectAll("myPoints")
            .data(d => d.values)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.date))
            .attr("cy", d => y(d.value))
            .attr("r", 4) // Reduced radius for better visibility
            .attr("stroke", "white");

        // Add a label at the end of each line
        svg.selectAll("myLabels")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .attr("class", d => d.name.replace(" ", "_"))
            .datum(d => ({ name: d.name, value: d.values[0] })) // Take the first value after reversing
            .attr("transform", d => "translate(" + x(d.value.date) + "," + y(d.value.value) + ")")
            .attr("x", 12)
           // .text(d => d.name)
            .style("fill", d => myColor(d.name))
            .style("font-size", 12); // Reduced font-size for better visibility

        // Add a legend (interactive)
        svg.selectAll("myLegend")
            .data(dataReady)
            .enter()
            .append('g')
            .append("text")
            .attr('x', (d, i) => 30 + i * 100) // Increased spacing between legend items
            .attr('y', 30)
            .text(d => d.name)
            .style("fill", d => myColor(d.name))
            .style("font-size", 12) // Reduced font-size for better visibility
            .on("click", function (event, d) {
                // Is the element currently visible?
                var currentOpacity = d3.selectAll("." + d.name.replace(" ", "_")).style("opacity");
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll("." + d.name.replace(" ", "_")).transition().style("opacity", currentOpacity == 1 ? 0 : 1);
            });
    });
}
