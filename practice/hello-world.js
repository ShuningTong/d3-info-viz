
// d3.select("body")
//     .append("p")
//     .text("New paragraph!");
    
var dataset = [ 5, 10, 15, 20, 25 ];
    
d3.select("body").selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    // 参数可以是一个变量，也可以是一个函数（javascript里面似乎变量和函数是一样的）
    .text(function(d){
        return d;
    })
    .style("color", function(d) {
        if (d > 15) {
            return "red";
        } else {
            return "black";
        }
    });