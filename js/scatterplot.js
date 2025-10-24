const drawScatterplot = (data) => {
    // Clear previous chart
    d3.select("#scatterplot").selectAll("*").remove();

    // Set the dimensions and margins of the chart area
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet");

    // Create an inner chart group with margins
    // Using assignment instead of const because it's declared in shared-constants
    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Set up x and y scales using data extents
    const xExtent = d3.extent(data, d => d.star);
    const yExtent = d3.extent(data, d => d.energyConsumption);

    xScaleS
        .domain([xExtent[0] - 0.5, xExtent[1] + 0.5])
        .range([0, innerWidth]);

    yScaleS
        .domain([yExtent[0], yExtent[1]])
        .range([innerHeight, 0])
        .nice();

    // Set up color scale for screen technology
    const uniqueTechs = [...new Set(data.map(d => d.screenTech))];
    colorScale
        .domain(uniqueTechs)
        .range(d3.schemeCategory10);

    // Draw the circles
    innerChartS
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("r", 4)
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);

    // Add bottom axis
    const bottomAxis = d3.axisBottom(xScaleS);
    innerChartS.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    // Add x-axis label
    svg.append("text")
        .text("Star Rating")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height - 5)
        .attr("class", "axis-label");

    // Add left axis
    const leftAxis = d3.axisLeft(yScaleS);
    innerChartS.append("g")
        .call(leftAxis);

    // Add y-axis label
    svg.append("text")
        .text("Labeled Energy Consumption (kWh/year)")
        .attr("x", 30)
        .attr("y", 20)
        .attr("class", "axis-label");

    // Add a legend on the right-hand side
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 140}, ${margin.top})`);

    uniqueTechs.forEach((tech, i) => {
        const g = legend.append('g').attr('transform', `translate(0, ${i * 22})`);
        
        g.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', colorScale(tech));
        
        g.append('text')
            .attr('x', 18)
            .attr('y', 10)
            .text(tech)
            .attr('class', 'axis-label');
    });
};