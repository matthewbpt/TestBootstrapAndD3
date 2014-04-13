/**
 * Created by matthew on 13/04/14.
 */

var lineGraph = function(node,data,colour) {

    // getting max x and y for scaling
    var xMax = d3.max(data, function (d) { return +d.x; });
    var yMax = d3.max(data, function (d) { return +d.y; });

    // creating axis scales
    var xAxisScale = d3.scale.linear().domain([0,xMax]).range([0,350]);
    var yAxisScale = d3.scale.linear().domain([0,yMax+1]).range([200,0]);

    // linefunction to create line from data
    var lineFunction = d3.svg.line()
        //apply  xaxis scale
        .x(function (d){ return xAxisScale(d.x) })
        //apply yaxis scale
        .y(function (d){ return yAxisScale(d.y) })
        //monotone type line
        .interpolate("monotone");

    var svgContainer = node.append("svg")
        .attr("width", 350)
        .attr("height", 200);

    //create and add axes
    var xAxis = d3.svg.axis().scale(xAxisScale);
    var yAxis = d3.svg.axis().scale(yAxisScale).ticks(4).orient("left");

    svgContainer.append("g")
        .attr("transform", "translate(0,199)")
        .call(xAxis);
    svgContainer.append("g")
        .attr("transform", "translate(1,0)")
        .call(yAxis);

    //add path to svgcontainer
    svgContainer.append("path")
        .attr("d", lineFunction(data))
        .attr("stroke", colour)
        .attr("stroke-width", 2)
        .attr("fill", "none");
};

var lineData1 = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
    { "x": 40,  "y": 5},  { "x": 60,  "y": 35},
    { "x": 80,  "y": 15},  { "x": 100,  "y": 45},
    { "x": 120, "y": 10},  { "x": 140,  "y": 1},
    { "x": 160, "y": 10},  { "x": 180,  "y": 1}];

var lineData2 = [ { "x": 1,   "y": 0},  { "x": 20,  "y": 25},
    { "x": 40,  "y": 13},  { "x": 60,  "y": 25},
    { "x": 80,  "y": 30},  { "x": 100,  "y": 45},
    { "x": 120, "y": 35},  { "x": 140,  "y": 30},
    { "x": 160, "y": 42},  { "x": 180,  "y": 29}];

var lineData3 = [ { "x": 1,   "y": 200},  { "x": 20,  "y": 210},
    { "x": 40,  "y": 130},  { "x": 60,  "y": 147},
    { "x": 80,  "y": 100},  { "x": 100,  "y": 75},
    { "x": 120, "y": 110},  { "x": 140,  "y": 129},
    { "x": 160, "y": 156},  { "x": 180,  "y": 192}];

lineGraph(d3.select("#graph1"),lineData1,"green");
lineGraph(d3.select("#graph2"),lineData2,"red");
lineGraph(d3.select("#graph3"),lineData3,"blue");
