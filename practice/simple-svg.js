var w = 500;
var h = 500;

var svg = d3.select("body").select("svg");

svg.attr("width", w)
   .attr("height", h);
   
var dataset = [5, 10, 15, 20, 25];


// 返回所有圆的空引用
var circles = svg.selectAll("circle")
    // 数据绑定
    .data(dataset)
    // 返回新元素的占位元素的引用
    .enter()
    // 最终添加circle到dom中
    .append("circle")
    // .attr("class", "pumpkin")
    // .style("cx", function(d){
    //     return d;
    // })
    ;

// looks like style and attr are the same thing
// looks like style defined here has higher priority than that defined in css
circles.attr("class", "pumpkin")
    .style("cx", function(d, i) {
        return (i * 50) + 25;
    })
    // h is the height of svg
    .style("cy", h/2)
    .style("r", function(d) {
        return d;
    });