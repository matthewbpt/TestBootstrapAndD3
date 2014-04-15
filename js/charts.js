/**
 * Created by matthew on 13/04/14.
 */
var charts = {
    horizontalColumnChart : function (node, data) {
        //set chart dimensions
        var margin = {top: 10, right: 0, bottom: 20, left: 30},
            width = 350 - margin.left - margin.right ,
            height = 240 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%b %Y").parse;

        // create svg element to hold chart
        var svgContainer = node.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var createChart = function(chartData) {
            svgContainer.selectAll("g").remove();
            // set scaling
            var max = d3.max(chartData, function (d) {
                return +d.value;
            });
            var scale = d3.scale.linear().domain([0, max]).range([0, width]);
            var verticalScale = d3.scale.ordinal()
                .rangeRoundBands([height, 0], .1)
                .domain(chartData.map(function (d) {
                    return d.category;
                }));

            var horizontalAxis = d3.svg.axis()
                .scale(scale)
                .orient("bottom");

            var verticalAxis = d3.svg.axis()
                .scale(verticalScale)
                .orient("left");

            var bar = svgContainer.selectAll("g")
                .data(chartData)
                .enter()
                .append("g")
                .attr("class", "bar")
                .attr("transform", function (d, i) {
                    return "translate(0," + i * (height / chartData.length) + ")";
                });

            bar.append("rect")
                .attr("width", 0)
                .transition()
                .delay(function (d, i) {
                    return 500 + 100 * i;
                })
                .duration(1500)
                .attr("width", function (d) {
                    return scale(d.value);
                })
                .attr("height", (height / chartData.length) - 1)
                .ease("elastic");

            svgContainer.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(0," + height + ")")
                .call(horizontalAxis);

            svgContainer.append("g")
                .attr("class", "x axis")
                .call(verticalAxis);
        };

        createChart(data);

        function filter(extent){
            if(!extent) {
                return;
            }

            var start = extent[0];
            var end = extent[1];
            var newData = data.filter(function(element) {
                var date = parseDate(element.date);
                return date >= start && date < end;
            });

            createChart(newData);
        }

        charts.timeRangeChangedListeners.push(filter);

        return svgContainer;
    },

    lineChart : function (node, data) {
        // set chart dimensions
        var margin = {top: 10, right: 0, bottom: 20, left: 25},
            width = 350 - margin.left - margin.right ,
            height = 200 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%b %Y").parse;

        // create container object for chart
        var svgContainer = node.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var createChart = function(chartData) {

            svgContainer.selectAll("g").remove();

            // create vertical scale
            var max = d3.max(chartData, function (d) {
                return +d.value;
            });
            var y = d3.scale.linear().domain([0, max]).range([height, 0]);

            //create horizontal scale
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1)
                .domain(chartData.map(function (d) {
                    return d.category;
                }));

            //create axis objects
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            // function to create path from data
            var lineFunction = d3.svg.line()
                //apply  x-axis scale
                .x(function (d) {
                    return x(d.category);
                })
                //apply y-axis scale
                .y(function (d) {
                    return y(d.value);
                })
                //monotone type line
                .interpolate("monotone");

            // add axes to contained object
            svgContainer.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
            svgContainer.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            var offset = (width / chartData.length) / 2;

            // add line path
            var line = svgContainer.append("g")
                .attr("transform", "translate(" + offset + ",0)")
                .attr("class", "line")
                .append("path")
                .attr("d", lineFunction(chartData));

            var totalLength = line.node().getTotalLength();

            line.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .delay(500)
                .duration(1500)
                .ease("linear")
                .attr("stroke-dashoffset", 0);
        };

        createChart(data);

        function filter(extent){
            if(!extent) {
                return;
            }

            var start = extent[0];
            var end = extent[1];
            var newData = data.filter(function(element) {
                var date = parseDate(element.date);
                return date >= start && date < end;
            });

            createChart(newData);
        }

        charts.timeRangeChangedListeners.push(filter);

        return svgContainer;
    },

    verticalColumnChart : function (node, data) {
        // set chart dimensions
        var parseDate = d3.time.format("%b %Y").parse;

        var margin = {top: 10, right: 0, bottom: 20, left: 25},
            width = 350 - margin.left - margin.right ,
            height = 200 - margin.top - margin.bottom;

        // create container object for chart
        var svgContainer = node.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var createChart = function(chartData) {

            svgContainer.selectAll("g").remove();
            svgContainer.selectAll(".bar").remove();

            // create vertical scale
            var max = d3.max(chartData, function (d) {
                return +d.value;
            });
            var y = d3.scale.linear().domain([0, max]).range([height, 0]);

            //create horizontal scale
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1)
                .domain(chartData.map(function (d) {
                    return d.category;
                }));

            //create axis objects
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            // add axes to contained object


            svgContainer.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);


            svgContainer.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            // add bars to chart
            var selection = svgContainer.selectAll(".bar")
                .data(chartData);

            selection.exit().remove();

            selection.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return x(d.category);
                })
                .attr("y", height)
                .attr("height", 0)
                .transition()
                .delay(function (d, i) {
                    return 500 + 100 * i;
                })
                .duration(1500)
                .attr("y", function (d) {
                    return y(d.value);
                })
                .attr("height", function (d) {
                    return height - y(d.value);
                })
                .ease("elastic")
                .attr("width", x.rangeBand());
        };

        createChart(data);

        function filter(extent){
            if(!extent) {
                return;
            }

            var start = extent[0];
            var end = extent[1];
            var newData = data.filter(function(element) {
                var date = parseDate(element.date);
                return date >= start && date < end;
            });

            createChart(newData);
        };

        charts.timeRangeChangedListeners.push(filter);

        return svgContainer;
    },

    pieChart : function (node, data) {
    // set dimensions
        var width = 350,
            height = 200,
            radius = 100,
            color = d3.scale.category20c();

        var parseDate = d3.time.format("%b %Y").parse;
        
        var svgContainer = node.append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + radius + ")");

        var createChart = function(chartData) {

            svgContainer.selectAll("g").remove();

            var selection = svgContainer.data([chartData]);

            var arc = d3.svg
                .arc()
                .outerRadius(radius)
                .innerRadius(radius - 50);

            var pie = d3.layout
                .pie()
                .value(function (d) {
                    return d.value;
                });

            var arcs = selection.selectAll("g.slice")
                .data(pie)
                .enter()
                .append("g")
                .attr("class", "slice");

            arcs.append("path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .transition().delay(function (d, i) {
                    return 500 + i * 100;
                }).duration(1500)
                .attrTween('d', function (d) {
                    var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                    return function (t) {
                        d.endAngle = i(t);
                        return arc(d);
                    }
                });
    //        arcs.append("text")
    //            .attr("transform", function (d) {
    //                //we have to make sure to set these before calling arc.centroid
    //                d.innerRadius = 0;
    //                d.outerRadius = radius;
    //                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
    //            })
    //            .attr("text-anchor", "middle")                          //center the text on it's origin
    //            .text(function (d, i) {
    //                return data[i].label;
    //            });

        };

        createChart(data);

        function filter(extent){
            if(!extent) {
                return;
            }

            var start = extent[0];
            var end = extent[1];
            var newData = data.filter(function(element) {
                var date = parseDate(element.date);
                return date >= start && date < end;
            });

            createChart(newData);
        };

        charts.timeRangeChangedListeners.push(filter);

        return svgContainer;

    },

    timeBar : function (node, data) {

        var margin = {top: 10, right: 25, bottom: 20, left: 25},
            width = 1170 - margin.left - margin.right ,
            height = 65 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%b %Y").parse;

        var x = d3.time.scale()
                .range([0, width])
                .domain(d3.extent(data.map(function (d) {
                    return parseDate(d.date);
                }))),
            y = d3.scale.linear()
                .range([height, 0])
                .domain([0, d3.max(data, function (d) {
                    return d.value;
                })]);

        //create axis objects
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var brush;
        var brushended =  function() {
            if (!d3.event.sourceEvent) return; // only transition after input
            var extent0 = brush.extent(),
                extent1 = extent0.map(d3.time.month.round);

            // if empty when rounded, use floor & ceil instead
            if (extent1[0] >= extent1[1]) {
                extent1[0] = d3.time.month.floor(extent0[0]);
                extent1[1] = d3.time.month.ceil(extent0[1]);
            }

            d3.select(this).transition()
                .call(brush.extent(extent1))
                .call(brush.event);

            charts.timeRangeChanged(extent1);
        };

        brush = d3.svg.brush()
            .x(x)
            .extent([parseDate(data[0].date), parseDate(data[1].date)])
            .on("brushend", brushended);

        var svgContainer = node.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var area = d3.svg.area()
            .interpolate("monotone")
            .x(function (d) {
                return x(parseDate(d.date));
            })
            .y0(height)
            .y1(function (d) {
                return y(d.value);
            });

        svgContainer.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // add line path
        svgContainer.append("g")
            .attr("class", "area")
            .append("path")
            .attr("d", area(data));

        var gBrush = svgContainer.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.event);

        gBrush.selectAll("rect")
            .attr("height", height);

        return svgContainer;
    },
    timeRangeChangedListeners: [],
    timeRangeChanged : function (extent){
        var i;
        for(i=0; i<charts.timeRangeChangedListeners.length; i++){
            charts.timeRangeChangedListeners[i](extent);
        }
    }
};