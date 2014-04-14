/**
 * Created by matthew on 13/04/14.
 */

var horizontalColumnChart = function(node,data){
    var height = 200, width = 350;
    // create div of class columnchart
    var svgContainer = node.append("svg")
        .attr("class", "barchart")
        .attr("width", width)
        .attr("height", height);

    // get max for scaling
    var max = d3.max(data);
    var scale = d3.scale.linear().domain([0,max]).range([0,width]);
    // add data to div

    var bar = svgContainer.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * (height / data.length) + ")"; });

    bar.append("rect")
        .attr("width", scale)
        .attr("height", (height / data.length) - 1);

    bar.append("text")
        .attr("x", function(d) { return scale(d) - 3; })
        .attr("y", 20/2)
        .attr("dy", ".35em")
        .text(function(d) { return d; });

    return svgContainer;
};

var lineChart = function(node,data){
    // set chart dimensions
    var margin = {top: 10 , right: 0, bottom: 20, left: 25},
        width = 350 - margin.left - margin.right ,
        height = 200 - margin.top - margin.bottom;

    // create vertical scale
    var max = d3.max(data, function(d) { return +d.value; });
    var y = d3.scale.linear().domain([0,max]).range([height,0]);

    //create horizontal scale
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(data.map(function(d) { return d.category; }));

    //create axis objects
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var lineFunction = d3.svg.line()
        //apply  x-axis scale
        .x(function (d){ return x(d.category); })
        //apply y-axis scale
        .y(function (d){ return y(d.value); })
        //monotone type line
        .interpolate("monotone");

    // create container object for chart
    var svgContainer = node.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add axes to contained object
    svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svgContainer.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // add bars to chart
    svgContainer.append("path")
        //.attr("class", "line")
        .attr("d", lineFunction(data))
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1)
        .attr("fill", "none");

    return svgContainer;
};

var verticalColumnChart = function(node,data){
    // set chart dimensions
    var margin = {top: 10 , right: 0, bottom: 20, left: 25},
        width = 350 - margin.left - margin.right ,
        height = 200 - margin.top - margin.bottom;

    // create vertical scale
    var max = d3.max(data, function(d) { return +d.value; });
    var y = d3.scale.linear().domain([0,max]).range([height,0]);

    //create horizontal scale
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(data.map(function(d) { return d.category; }));

    //create axis objects
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // create container object for chart
    var svgContainer = node.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add axes to contained object
    svgContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svgContainer.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // add bars to chart
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

var  pieChart = function(node,data){
    // set dimensions
    var width = 350,
        height = 200,
        radius = 100,
        color = d3.scale.category20c();

    var svgContainer = node.append("svg")
        .data([data])
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("transform", "translate(" + width/2 + "," + radius + ")");

    var arc = d3.svg
        .arc()
        .outerRadius(radius);

    var pie = d3.layout
        .pie()
        .value(function(d) { return d.value; });

    var arcs = svgContainer.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("svg:g")
        .attr("class","slice");

    arcs.append("svg:path")
        .attr("fill", function(d,i){ return color(i); })
        .attr("d", arc);

    arcs.append("svg:text")                                     //add a label to each slice
        .attr("transform", function(d) {                    //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.innerRadius = 0;
            d.outerRadius = radius;
            return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
        })
        .attr("text-anchor", "middle")                          //center the text on it's origin
        .text(function(d, i) { return data[i].label; });

    return svgContainer;

};
/*
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
*/


