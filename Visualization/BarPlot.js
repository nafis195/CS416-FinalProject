function drawBarPlot() {
    // Remove any existing SVG element to avoid duplication
    d3.select("#bar-plot-container").select("svg").remove();

    // Set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 150, left: 60 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Append the svg object to the bar plot container
    var svg = d3.select("#bar-plot-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Read the data
    d3.csv('./Dataset/US_Car_Accident_Dataset.csv').then(data => {
        data.forEach(d => {
            d.Fatalities_in_Crash = +d.Fatalities_in_Crash;
        });

        // Aggregate data by Atmospheric_Condition
        const aggregatedData = d3.rollups(
            data,
            v => d3.sum(v, d => d.Fatalities_in_Crash),
            d => d.Atmospheric_Condition
        ).map(([key, value]) => ({ Atmospheric_Condition: key, Fatalities_in_Crash: value }));

        // X axis
        const x = d3.scaleBand()
            .range([0, width])
            .domain(aggregatedData.map(d => d.Atmospheric_Condition))
            .padding(0.1);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-65)")
            .style("text-anchor", "end")
            .attr("dx", "-0.8em")
            .attr("dy", "0.15em");

        // Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(aggregatedData, d => d.Fatalities_in_Crash)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Bars
        svg.selectAll(".bar")
            .data(aggregatedData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.Atmospheric_Condition))
            .attr("width", x.bandwidth())
            .attr("y", d => y(d.Fatalities_in_Crash))
            .attr("height", d => height - y(d.Fatalities_in_Crash))
            .attr("fill", "#69b3a2");
    }).catch(error => {
        console.error('Error loading the data:', error);
    });
}
