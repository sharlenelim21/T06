// Set up dimensions and margins
const margin = { top: 50, right: 30, bottom: 50, left: 70 };
const width = 800; // Total width of the chart
const height = 400; // Total height of the chart
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Declare innerChartS for scatterplot (will be assigned in scatterplot.js)
let innerChartS;

// Tooltip dimensions
const tooltipWidth = 180;
const tooltipHeight = 70;

// Create a bin generator using d3.bin
const binGenerator = d3.bin()
    .value(d => d.energyConsumption) // Accessor for energyConsumption
    .thresholds(20); // Number of bins

// Set up the scales for histogram
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Set up scales for scatterplot
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();
const colorScale = d3.scaleOrdinal();

// Make the colours accessible globally
const barColor = "#606464";
const bodyBackgroundColor = "#fffaf0";

// Make the filter options accessible globally
const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];

// Screen size filter options
const filters_size = [
    { id: "all", label: "All", isActive: true },
    { id: "32", label: "32\"", isActive: false },
    { id: "40", label: "40\"", isActive: false },
    { id: "42", label: "42\"", isActive: false },
    { id: "43", label: "43\"", isActive: false },
    { id: "50", label: "50\"", isActive: false },
    { id: "55", label: "55\"", isActive: false },
    { id: "65", label: "65\"", isActive: false },
    { id: "75", label: "75\"", isActive: false },
    { id: "85", label: "85\"", isActive: false }
];

// Active filter tracking
let activeScreenFilter = "all";
let activeSizeFilter = "all";

// Global data storage
let globalData = [];