// Annotation.js
function drawAnnotatedLineChart() {
    // Remove any existing SVG elements
    d3.select("#annotation-chart-container").select("svg").remove();

    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 70, left: 60 }, // Increased bottom margin for labels
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Append the svg object to the body of the page
    const svg = d3.select("#annotation-chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Read the data
    d3.csv("./Dataset/US_Car_Accident_Dataset.csv", d => ({
        date: d3.timeParse("%Y-%m-%d")(d.Crash_Date),
        fatalities: +d.Fatalities_in_Crash
    })).then(data => {
        // Aggregate data by date
        const dailyData = d3.rollups(
            data,
            v => d3.sum(v, d => d.fatalities),
            d => d.date
        ).map(([key, value]) => ({ date: key, totalFatalities: value }));

        // Sort data by date
        dailyData.sort((a, b) => d3.ascending(a.date, b.date));

        // Add X axis
        const x = d3.scaleTime()
            .domain(d3.extent(dailyData, d => d.date))
            .range([0, width]);

        const xAxis = svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%B"))); // Format x-axis labels as month names

        xAxis.selectAll("text")
            .attr("transform", "translate(-10,10)rotate(-45)") // Rotate labels for better visibility
            .style("text-anchor", "end");

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(dailyData, d => d.totalFatalities)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
            .datum(dailyData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.date))
                .y(d => y(d.totalFatalities))
            );

        // Find highest and lowest points
        const highestPoint = dailyData.reduce((a, b) => (a.totalFatalities > b.totalFatalities ? a : b));
        const lowestPoint = dailyData.reduce((a, b) => (a.totalFatalities < b.totalFatalities ? a : b));

        // Add annotations
        const annotations = [
            {
                note: {
                    label: `Highest: ${highestPoint.totalFatalities} fatalities`,
                    title: "Highest Fatalities"
                },
                x: x(highestPoint.date),
                y: y(highestPoint.totalFatalities),
                dy: -40,
                dx: 0
            },
            {
                note: {
                    label: `Lowest: ${lowestPoint.totalFatalities} fatalities`,
                    title: "Lowest Fatalities"
                },
                x: x(lowestPoint.date),
                y: y(lowestPoint.totalFatalities),
                dy: 40,
                dx: 0
            }
        ];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations);

        svg.append("g")
            .call(makeAnnotations);
    });
}

// Call the function to draw the annotated line chart
drawAnnotatedLineChart();
