/**
 * Created by matthew on 13/04/14.
 */

var horizontalColumnChart = function(node,data){
    //set chart dimensions
    var margin = {top: 10 , right: 0, bottom: 20, left: 30},
        width = 350 - margin.left - margin.right ,
        height = 240 - margin.top - margin.bottom;
    // create div of class columnchart
    var svgContainer = node.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // get max for scaling
    var max = d3.max(data, function(d) { return +d.value; });
    var scale = d3.scale.linear().domain([0,max]).range([0,width]);
    var verticalScale = d3.scale.ordinal()
        .rangeRoundBands([height, 0], .1)
        .domain(data.map(function(d) { return d.category; }));

    var horizontalAxis = d3.svg.axis()
        .scale(scale)
        .orient("bottom");

    var verticalAxis = d3.svg.axis()
        .scale(verticalScale)
        .orient("left");

    var bar = svgContainer.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { return "translate(0," + i * (height / data.length) + ")"; });

    bar.append("rect")
        .attr("width", function(d){ return scale(d.value); })
        .attr("height", (height / data.length) - 1);

    svgContainer.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0," + height + ")")
        .call(horizontalAxis);

    svgContainer.append("g")
        .attr("class", "x axis")
        .call(verticalAxis);

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
    svgContainer.append("g")
        .attr("class", "line")
        .append("path")
        .attr("d", lineFunction(data));

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
        .append("g")
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
        .append("g")
        .attr("class","slice");

    arcs.append("path")
        .attr("fill", function(d,i){ return color(i); })
        .attr("d", arc);

    arcs.append("text")                                     //add a label to each slice
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

