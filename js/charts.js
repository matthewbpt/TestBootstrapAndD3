/**
 * Created by matthew on 13/04/14.
 */
var charts = {
    horizontalColumnChart : function (node, data) {
        'use strict';
        var margin = {top: 10, right: 0, bottom: 20, left: 30},
            width = 360 - margin.left - margin.right,
            height = 240 - margin.top - margin.bottom,
            svgContainer,
            parseDate,
            createChart,
            filter;

        parseDate = d3.time.format("%b %Y").parse;

        // create svg element to hold chart
        svgContainer = node.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        createChart = function (chartData) {
            var max, scale, verticalScale, horizontalAxis, verticalAxis, bar;

            svgContainer.selectAll("g").remove();
            // set scaling
            max = d3.max(chartData, function (d) {
                return +d.value;
            });
            scale = d3.scale.linear().domain([0, max]).range([0, width]);
            verticalScale = d3.scale.ordinal()
                .rangeRoundBands([0, height], 0.1)
                .domain(chartData.map(function (d) {
                    return d.category;
                }));

            horizontalAxis = d3.svg.axis()
                .scale(scale)
                .orient("bottom");

            verticalAxis = d3.svg.axis()
                .scale(verticalScale)
                .orient("left");

            bar = svgContainer.selectAll("g")
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
                    return 100 * i;
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

        filter = function (extent) {
            var start, end, newData;
            if (!extent) {
                return;
            }

            start = extent[0];
            end = extent[1];
            newData = data.filter(function (element) {
                var date = parseDate(element.date);
                return date >= start && date < end;
            });

            createChart(newData);
        };

        charts.timeRangeChangedListeners.push(filter);

        return svgContainer;
    },

    lineChart : function (node, data) {
        'use strict';
        var margin = {top: 10, right: 0, bottom: 20, left: 25},
            width = 360 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom,
            parseDate = d3.time.format("%b %Y").parse,
            svgContainer,
            createChart,
            filter;

        parseDate = d3.time.format("%b %Y").parse;

        // create container object for chart
        svgContainer = node.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        createChart = function (chartData) {
            var max, x, y, xAxis, yAxis, lineFunction, offset, line, totalLength, selection;
            svgContainer.selectAll("g").remove();
            svgContainer.selectAll(".bar").remove();
            // create vertical scale
            max = d3.max(chartData, function (d) {
                return +d.value;
            });
            y = d3.scale.linear().domain([0, max]).range([height, 0]);

            //create horizontal scale
            x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1)
                .domain(chartData.map(function (d) {
                    return d.category;
                }));

            //create axis objects
            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            // function to create path from data
            lineFunction = d3.svg.line()
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

            offset = (width / chartData.length) / 2;


            if (chartData.length > 1) {
                // add line path
                line = svgContainer.append("g")
                    .attr("transform", "translate(" + offset + ",0)")
                    .attr("class", "line")
                    .append("path")
                    .attr("d", lineFunction(chartData));

                totalLength = line.node().getTotalLength();

                line.attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(1500)
                    .ease("linear")
                    .attr("stroke-dashoffset", 0);
            } else {
                selection = svgContainer.selectAll(".bar")
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
                        return 100 * i;
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
            }
        };

        createChart(data);

        filter = function (extent) {
            var start, end, newData;
            if (!extent) {
                return;
            }

            start = extent[0];
            end = extent[1];
            newData = data.filter(function (element) {
                var date = parseDate(element.date);
                return date >= start && date < end;
            });

            createChart(newData);
        };

        charts.timeRangeChangedListeners.push(filter);

        return svgContainer;
    },

    verticalColumnChart : function (node, data) {
        'use strict';
        // set chart dimensions
        var margin = {top: 10, right: 0, bottom: 20, left: 25},
            width = 360 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom,
            parseDate = d3.time.format("%b %Y").parse,
            svgContainer,
            createChart,
            filter;

        // create container object for chart
        svgContainer = node.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        createChart = function (chartData) {
            var max, y, x, xAxis, yAxis, selection;
            svgContainer.selectAll("g").remove();
            svgContainer.selectAll(".bar").remove();

            // create vertical scale
            max = d3.max(chartData, function (d) {
                return +d.value;
            });
            y = d3.scale.linear().domain([0, max]).range([height, 0]);

            //create horizontal scale
            x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1)
                .domain(chartData.map(function (d) {
                    return d.category;
                }));

            //create axis objects
            xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            yAxis = d3.svg.axis()
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
            selection = svgContainer.selectAll(".bar")
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
                    return 100 * i;
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

        filter = function (extent) {
            var start, end, newData;
            if (!extent) {
                return;
            }

            start = extent[0];
            end = extent[1];
            newData = data.filter(function (element) {
                var date = parseDate(element.date);
                return date >= start && date < end;
            });

            createChart(newData);
        };

        charts.timeRangeChangedListeners.push(filter);

        return svgContainer;
    },

    pieChart : function (node, data) {
        'use strict';
    // set dimensions
        var width = 360,
            height = 200,
            radius = 100,
            color = d3.scale.category20c(),
            parseDate = d3.time.format("%b %Y").parse,
            svgContainer = node.append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + radius + ")"),
            createChart,
            filter;

        createChart = function (chartData) {
            var selection, arc, arc2, arc3, pie, arcs;
            svgContainer.selectAll("g").remove();

            selection = svgContainer.data([chartData]);

            arc = d3.svg
                .arc()
                .outerRadius(radius - 10)
                .innerRadius(radius - 40);

            arc2 = d3.svg
                .arc()
                .outerRadius(radius)
                .innerRadius(radius - 40);

            arc3 = d3.svg
                .arc()
                .outerRadius(radius - 42.5)
                .innerRadius(radius - 45);

            pie = d3.layout
                .pie()
                .value(function (d) {
                    return d.value;
                });

            arcs = selection.selectAll("g.slice")
                .data(pie)
                .enter()
                .append("g")
                .attr("class", "slice")
                .on("mouseover", function (d, i) {

                    d3.select(this)
                        .select("path")
                        .transition()
                        .duration(250).attr("d", arc2);

                    d3.select(this)
                        .append("path")
                        .attr("id","hover")
                        .attr("fill", color(i))
                        .transition()
                        .duration(250)
                        .attr("d", arc3);

                    d3.select(this.parentNode)
                        .append("text")
                        .attr("text-anchor", "middle")
                        .text(chartData[i].category + ": " + chartData[i].value);
                })
                .on("mouseout", function (d, i) {
                    d3.select(this)
                        .select("path")
                        .transition()
                        .duration(250)
                        .attr("d", arc);

                    d3.select(this)
                        .select("#hover")
                        .remove();

                    d3.select(this.parentNode)
                        .select("text")
                        .remove();
                });

            arcs.append("path")
                .attr("fill", function (d, i) {
                    return color(i);
                })
                .transition().delay(function (d, i) {
                    return i * 100;
                }).duration(1500)
                .attrTween('d', function (d) {
                    d.startAngle = d.startAngle + 0.02;
                    d.endAngle = d.endAngle - 0.02;
                    var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
                    return function (t) {
                        d.endAngle = i(t);
                        return arc(d);
                    };
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

        filter = function (extent) {
            var start, end, newData;
            if (!extent) {
                return;
            }

            start = extent[0];
            end = extent[1];
            newData = data.filter(function (element) {
                var date = parseDate(element.date);
                return date >= start && date < end;
            });

            createChart(newData);
        };

        charts.timeRangeChangedListeners.push(filter);

        return svgContainer;

    },

    timeBar : function (node, data) {
        'use strict';
        var margin = {top: 10, right: 25, bottom: 20, left: 25},
            width = 1140 - margin.left - margin.right,
            height = 65 - margin.top - margin.bottom,
            parseDate = d3.time.format("%b %Y").parse,
            x,
            y,
            xAxis,
            brush,
            brushended,
            svgContainer,
            area,
            gBrush;

        x = d3.time.scale()
            .range([0, width])
            .domain(d3.extent(data.map(function (d) {
                return parseDate(d.date);
            })));
        y = d3.scale.linear()
            .range([height, 0])
            .domain([0, d3.max(data, function (d) {
                return d.value;
            })]);

        //create axis objects
        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        brushended =  function () {
            if (!d3.event.sourceEvent) {
                return; // only transition after input
            }
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

        svgContainer = node.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        area = d3.svg.area()
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

        gBrush = svgContainer.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.event);

        gBrush.selectAll("rect")
            .attr("height", height);

        return svgContainer;
    },

    timeRangeChangedListeners: [],

    timeRangeChanged : function (extent) {
        'use strict';
        var i;
        for (i = 0; i < charts.timeRangeChangedListeners.length; i = i + 1) {
            charts.timeRangeChangedListeners[i](extent);
        }
    }
};