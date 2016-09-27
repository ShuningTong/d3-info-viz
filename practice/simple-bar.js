var data = [];                        
for (var i = 0; i < 25; i++) {           
    var newNumber = Math.round(Math.random() * 30);  
    data.push(newNumber);             
}

d3.select("body").selectAll("div")
    // 有多少数据就生成多少div
    .data(data)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d) {
        var barHeight = d * 5;
        return barHeight + "px";
    }); 