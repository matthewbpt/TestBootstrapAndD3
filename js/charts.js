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

    // line function to create line from data
    var lineFunction = d3.svg.line()
        //apply  x-axis scale
        .x(function (d){ return xAxisScale(d.x); })
        //apply y-axis scale
        .y(function (d){ return yAxisScale(d.y); })
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

    //add path to svg container
    svgContainer.append("path")
        .attr("d", lineFunction(data))
        .attr("stroke", colour)
        .attr("stroke-width", 2)
        .attr("fill", "none");

    return svgContainer;
};

var horizontalColumnChart = function(node,data){
    // create div of class columnchart
    var svgContainer = node.append("svg")
        .attr("class", "barchart")
        .attr("width", 350)
        .attr("height", 200);

    // get max for scaling
    var max = d3.max(data);
    var scale = d3.scale.linear().domain([0,max]).range([0,350]);
    // add data to div

    var bar = svgContainer.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    bar.append("rect")
        .attr("width", scale)
        .attr("height", 19);

    bar.append("text")
        .attr("x", function(d) { return scale(d) - 3; })
        .attr("y", 20/2)
        .attr("dy", ".35em")
        .text(function(d) { return d; });

    return svgContainer;
};

var verticalColumnChart = function(node,data){
    // create div of class columnchart
    var margin = {top: 0 , right: 0, bottom: 20, left: 20};

    var width = 350 - margin.left - margin.right ,
        height = 200 - margin.top - margin.bottom;

    var max = d3.max(data, function(d) { return +d.value; });
    var y = d3.scale.linear().domain([0,max]).range([height,0]);

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(data.map(function(d) { return d.category; }));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svgContainer = node.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svgContainer.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svgContainer.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.category); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x.rangeBand());

    return svgContainer;
};

var lineData1 = [ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
    { "x": 40,  "y": 5},  { "x": 60,  "y": 35},
    { "x": 80,  "y": 15},  { "x": 100,  "y": 45},
    { "x": 120, "y": 10},  { "x": 140,  "y": 1},
    { "x": 160, "y": 10},  { "x": 180,  "y": 1}];

var lineData3 = [ { "x": 1,   "y": 100},  { "x": 20,  "y": 210},
    { "x": 40,  "y": 130},  { "x": 60,  "y": 147},
    { "x": 80,  "y": 100},  { "x": 100,  "y": 75},
    { "x": 120, "y": 110},  { "x": 140,  "y": 129},
    { "x": 160, "y": 156},  { "x": 180,  "y": 140}];

var chartData = [10,20,30,40,30,10,34,98,23,34,32,12,23,56,43,1];

var moreData = [{ category: "Jan", value: 10},
    { category: "Feb", value: 20},
    { category: "Mar", value: 30},
    { category: "Apr", value: 40},
    { category: "May", value: 30},
    { category: "Jun", value: 10},
    { category: "Jul", value: 34},
    { category: "Aug", value: 98},
    { category: "Sep", value: 23},
    { category: "Oct", value: 34},
    { category: "Nov", value: 32},
    { category: "Dec", value: 12}];

lineGraph(d3.select("#graph1"),lineData1,"green");
horizontalColumnChart(d3.select("#graph2"),chartData);
verticalColumnChart(d3.select("#graph3"), moreData);
// lineGraph(d3.select("#graph3"),lineData3,"blue");
