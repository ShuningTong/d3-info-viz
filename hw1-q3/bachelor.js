var width, height, svg, g, albersProjection, geoPath, colorScale, legend;
var columnNames = ["v1990", "v2000", "v2006", "v2007", "v2008", "v2009"];
var isPlaying = false;
var currentColumn = 0;
var colorRange = ['rgb(241,238,246)','rgb(189,201,225)','rgb(116,169,207)','rgb(43,140,190)','rgb(4,90,141)'];
var p = d3.precisionFixed(1);
var p2 = d3.precisionFixed(0.2);
var f = d3.format("." + p + "f");
var f2 = d3.format("." + p2 + "f");

function init() {
    setMap();
    animateMap();
}

function setMap(){
    width = 1000,
    height = 600;
        
    isPlaying = false;
    
    svg = d3.select("body")
      .append("svg")
      .attr("x", "100")
      .attr("y", "100")
      .attr( "width", width )
      .attr( "height", height )
      .attr("display", "block");
    
    g = svg.append( "g" );
    
    // albersUsa is the default projection of d3
    albersProjection = d3.geoAlbersUsa()
                                // default scale is 1000
                                .scale(1000)
                            //   .rotate( [71.057,0] )
                            //   .center( [0, 42.313] )
                                .translate( [width/2,height/2] );
    
    // path generator, translate geoJson coordinates into SVG path codes
    geoPath = d3.geoPath()
                    .projection( albersProjection );
                    
    colorScale = d3.scaleQuantize()
                    .range(colorRange);
    
    legend = g.append('g')
        .attr('class', 'legend')
        .attr('x', width / 2)
        .attr('y', 0)
        .attr('height', 60)
        .attr('width', 60);
        
    g.append("text")
        .attr("text-anchor", "center")
        .attr("class", "title")
        .attr("dy", 50)
        .attr("dx", width / 2 - 290)
        .attr("font-size", "20px")
        .text("Percentage of bachelor educated people from 1990 to 2009 in USA");
        
    loadData();
}

function loadData() {

  d3.queue()   // queue function loads all external data files asynchronously 
    .defer(d3.json, "./us-states.json")  // our geometries
    .defer(d3.csv, "./bachelor.csv")  // and associated data in csv file
    .await(processData);   // once all files are loaded, call the processData function passing
                           // the loaded objects as arguments
}

function processData(error, usStates, bachelor){
    colorScale.domain([d3.min(bachelor, function(d){return d.v1990;}),
                    d3.max(bachelor, function(d){return d.v2009;})]);
                    
    for (var i = 0; i < bachelor.length; i++){
        var csvState = bachelor[i].state;
        for (var j = 0; j < usStates.features.length; j++){
            var jsonState = usStates.features[j].properties.name;
            if (jsonState == csvState){
                for (var k = 0; k < columnNames.length; k++){
                    var columnName = columnNames[k];
                    usStates.features[j].properties[columnName] = parseFloat(bachelor[i][columnName]);
                }
                break;
            }
        }
    }
    loadLegend();
    drawMap(usStates);
}

function drawMap(usStates){
    var columnName = columnNames[0];
    g.selectAll("path")
        .data(usStates.features) // this json variable is from d3.json's callback
        .enter()
        .append("path")
        .attr("d", geoPath)
        .style("fill", function(d){
            var value = d.properties[columnName];
            if (value){
                return colorScale(value);
            } else {
                return "#ccc";
            }
        })
        .on('mouseover', function(d){
            d3.select("#detail").text(d.properties.name + " " + f2(d.properties[columnName]) + "%");
            d3.select(this).attr("stroke", "black");
        })
        .on('mouseout', function(d){
            d3.select("#detail").text("");
            d3.select(this).attr("stroke", "transparent");
        });
}

function animateMap(){
    var timer;
    
    d3.select("#play")
        .attr("title","Play animation")
        .on("click",function(){
            if ( !isPlaying ){
                isPlaying = true;
                d3.select(this).classed("pause",true).attr("title","Pause animation");
                
                // start of animation
                timer = setInterval( function(){
                    if (currentColumn < columnNames.length - 1){
                        currentColumn++;
                    } else {
                        currentColumn = 0;
                    }
                    updateMap();
                    d3.select('#clock').html(columnNames[currentColumn].substring(1));
                }, 1250);
                // end of animation
                
            } else {
                isPlaying = false;
                d3.select(this).classed("pause",false).attr("title","Play animation");
                clearInterval(timer);
            }
        });
}

function updateMap(){
    var columnName = columnNames[currentColumn];
    d3.selectAll("path")
        .transition()
        .duration(750)
        .style("fill", function(d){
            var value = d.properties[columnName];
            if (value){
                return colorScale(value);
            } else {
                return "#ccc";
            }
        });
    d3.selectAll("path")
        .on('mouseover', function(d){
            d3.select("#detail").text(d.properties.name + " " + f2(d.properties[columnName]) + "%");
            d3.select(this).attr("stroke", "black");
        })
        .on('mouseout', function(d){
            d3.select("#detail").text("");
            d3.select(this).attr("stroke", "transparent");
        });
}

function loadLegend(){
    var legendEnter = legend.selectAll('.legend-element')
                            .data(colorRange)
                            .enter().append('g')
                            .attr('class', 'legend-element')
                            .attr('transform', function (d, i) {
                                var xSpace = 0;
                                var ySpace = 300 - 45 * i;
                                return "translate(" + xSpace + ", " + ySpace + ")";
                            });
        

    legendEnter.append("rect")
                .attr("width", 30)
                .attr("height", 30)
                .attr("fill", function(d, i){
                        return d;
                });
    
    legendEnter.append('text')
          .attr('text-anchor', 'start')
          .attr('class','nv-legend-text')
          .attr('dy', '1.2em')
          .attr('dx', '40')
          .text(function(d, i){
              var extent = colorScale.invertExtent(d);
              return f(extent[0]) + "% ~ " + f(extent[1]) + "%";
          });
}


init();



    
