const populateFilters = (data) => {
    // Populate screen technology filters
    d3.select("#filters_screen")
        .selectAll(".filter")
        .data(filters_screen)
        .join("button")
        .attr("class", d => d.isActive ? "filter active" : "filter")
        .text(d => d.label)
        .on("click", (e, d) => {
            console.log("Clicked filter:", e);
            console.log("Clicked filter data:", d);

            // Update the status of the button - make sure button clicked is not already active
            if (!d.isActive) {
                filters_screen.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false;
                });
            }

            // Update the filter buttons based on which one was clicked
            d3.selectAll("#filters_screen .filter")
                .classed("active", filter => filter.id === d.id ? true : false);

            // Update active filter
            activeScreenFilter = d.id;

            // Pass the id of the active button and the data to an update function
            updateHistogram();
        });

    // Populate screen size filters
    d3.select("#filters_size")
        .selectAll(".filter")
        .data(filters_size)
        .join("button")
        .attr("class", d => d.isActive ? "filter active" : "filter")
        .text(d => d.label)
        .on("click", (e, d) => {
            // Update the status of the button
            if (!d.isActive) {
                filters_size.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false;
                });
            }

            // Update the filter buttons
            d3.selectAll("#filters_size .filter")
                .classed("active", filter => filter.id === d.id ? true : false);

            // Update active filter
            activeSizeFilter = d.id;

            // Update the histogram
            updateHistogram();
        });

    const updateHistogram = () => {
        // Create updatedData and check if the id passed from previous function is "all"
        // If it is then don't run the filter. If it's not all, then filter the data
        const updatedData = globalData.filter(tv => {
            let screenMatch = activeScreenFilter === "all" || tv.screenTech === activeScreenFilter;
            let sizeMatch = activeSizeFilter === "all" || tv.screenSize === parseInt(activeSizeFilter);
            return screenMatch && sizeMatch;
        });

        // Use filtered data to update the bins using binGenerator
        const updatedBins = binGenerator(updatedData);

        // Use the updatedBins to draw the histogram rectangles and apply transitions
        const svg = d3.select("#histogram");
        svg.selectAll("*").remove();

        const innerChart = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Update scales
        const minEng = updatedBins[0].x0;
        const maxEng = updatedBins[updatedBins.length - 1].x1;
        const binsMaxLength = d3.max(updatedBins, d => d.length);

        xScale.domain([minEng, maxEng]);
        yScale.domain([0, binsMaxLength]).nice();

        // Draw bars with transition
        innerChart
            .selectAll("rect")
            .data(updatedBins)
            .join("rect")
            .attr("x", d => xScale(d.x0))
            .attr("width", d => xScale(d.x1) - xScale(d.x0) - 2)
            .attr("y", innerHeight)
            .attr("height", 0)
            .attr("fill", barColor)
            .attr("stroke", bodyBackgroundColor)
            .attr("stroke-width", 2)
            .transition()
            .duration(500)
            .ease(d3.easeCubicInOut)
            .attr("y", d => yScale(d.length))
            .attr("height", d => innerHeight - yScale(d.length));

        // Add axes
        const bottomAxis = d3.axisBottom(xScale);
        innerChart.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(bottomAxis);

        svg.append("text")
            .text("Labeled Energy Consumption (kWh/year)")
            .attr("text-anchor", "end")
            .attr("x", width - 20)
            .attr("y", height - 5)
            .attr("class", "axis-label");

        const leftAxis = d3.axisLeft(yScale);
        innerChart.append("g")
            .call(leftAxis);

        svg.append("text")
            .text("Frequency")
            .attr("x", 30)
            .attr("y", 20)
            .attr("class", "axis-label");
    };
};

// ============================================
// TOOLTIP FUNCTIONALITY FOR SCATTERPLOT
// ============================================

const createTooltip = (data) => {
    // Append tooltip to innerChartS
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Append tooltip background rectangle
    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.75);

    // Append tooltip text
    tooltip
        .append("text")
        .text("NA")
        .attr("x", tooltipWidth/2)
        .attr("y", tooltipHeight/2 + 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "white")
        .style("font-weight", 900);
};

const handleMouseEvents = () => {
    // Select all the circles in our scatter plot
    innerChartS.selectAll("circle")
        .on("mouseenter", (e, d) => {
            console.log("Mouse entered circle", d);

            // Update tooltip text with screen size
            d3.select(".tooltip text")
                .text(d.screenSize);

            // Get circle center position
            const cx = e.target.getAttribute("cx");
            const cy = e.target.getAttribute("cy");

            // Position and show tooltip
            d3.select(".tooltip")
                .attr("transform", `translate(${cx - 0.5*tooltipWidth}, ${cy - 1.5*tooltipHeight})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })
        .on("mouseleave", (e, d) => {
            console.log("Mouse left circle", d);

            // Hide tooltip
            d3.select(".tooltip")
                .style("opacity", 0)
                .attr("transform", `translate(0, 500)`);
        });
};