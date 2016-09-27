var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var xScale = d3.scaleTime().range([0, width]);
var zScale = d3.scaleOrdinal(d3.schemeCategory10);
var yScale = d3.scaleLinear().range([height, 0]);

var parseTime = d3.timeParse("%Y");

var line = d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d.x); })
            .y(function(d) { return yScale(d.y); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("scatterplot-multi-series.csv", function(error, data) {
    if (error) throw error;  // Compute the series names ("y1", "y2", etc.) from the loaded CSV.
    var seriesNames = d3.keys(data[0])
        .filter(function(d) { return d !== "x"; })
        .sort();  // Map the data to an array of arrays of {x, y} tuples.
    var series = seriesNames.map(function(series) {
        return data.map(function(d) {
            return {x: +parseTime(d.x), y: +d[series]};
        });
    });
    
    xScale.domain(d3.extent(data, function(d) { return parseTime(d.x); }));
    yScale.domain([
        d3.min(series, function(c) { return d3.min(c, function(d) { return d.y; }); }),
        d3.max(series, function(c) { return d3.max(c, function(d) { return d.y; }); })]);

    // Add the points!
    var group = svg.selectAll(".series")
       .data(series)
       .enter()
       .append("g")
       .attr("class", "series")
       .style("fill", function(d, i) { return zScale(i); });
       
       
    group.selectAll(".point")
       .data(function(d) { return d; })
       .enter()
       .append("circle")
       .attr("class", "point")
       .attr("r", 4.5)
       .attr("cx", function(d) { return xScale(d.x); })
       .attr("cy", function(d) { return yScale(d.y); });
       
    group.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d); });
      
    var xAxis = d3.axisBottom(xScale).tickFormat(function(d){return d3.timeFormat("%Y")(new Date(d)); });
    var yAxis = d3.axisLeft(yScale);
    
    svg.append("g")
       .attr("class", "axis")
       .attr("transform", "translate(0, " + height + ")")
       .call(xAxis)
       .append("text")
       .attr("y", 20)
       .attr("x", width)
       .attr("dy", "1em")
       .style("text-anchor", "end")
       .attr("fill", "#000")
       .text("Year");
       
    svg.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#000")
        .text("Percentage");
        
    var legend = svg.append('g')
        .attr('class', 'legend')
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('height', 60)
        .attr('width', 200);
        
    var legendEnter = legend.selectAll('.legend-series')
                            .data(series)
                            .enter().append('g')
                            .attr('class', 'legend-series')
                            .attr('transform', function (d, i) {
                                var xSpace =  width - 5 * margin.right;
                                var ySpace = 80 + 30 * i;
                                return "translate(" + xSpace + ", " + ySpace + ")";
                                
                            });
    legendEnter.append('circle')
        .attr('r', 5)
        .style('fill', function(d, i) {
            return zScale(i);
        });

    legendEnter.append('text')
          .attr('text-anchor', 'start')
          .attr('class','nv-legend-text')
          .attr('dy', '.5em')
          .attr('dx', '8')
          .text(function(d, i) {
              if (i == 0){
                  return "high school";
              } else if (i == 1){
                  return "bachelor";
              } else {
                  return "advanced";
              }
          });
          
    
});

svg.append("text")
    .attr("text-anchor", "center")
    .attr("class", "title")
    .attr("dx", width / 2 - 150)
    .attr("font-size", "15px")
    .text("Percentage of educated people from 1990 to 2009");


// var legend = svg.selectAll(".legend")
//                 .data(zScale.domain())
//                 .enter().append("g")
//                 .attr("class", "legend")
//                 .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// legend.append("rect")
//       .attr("x", width - 18)
//       .attr("width", 18)
//       .attr("height", 18)
//       .style("fill", zScale);

// legend.append("text")
//       .attr("x", width - 24)
//       .attr("y", 9)
//       .attr("dy", ".35em")
//       .style("text-anchor", "end")
//       .text(function(d) { return d; });


 
