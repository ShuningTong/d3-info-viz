var w = 500;
var h = 100;

var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
                11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
                
var averLen = w / dataset.length;
var barPadding = 1;

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
            
// will adjust width according to the length of dataset and always keep gap 1
svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", function(d, i){
       return i * (w / dataset.length);
   })
//   柱子的顶端，所以我们对每个数据点都有不同的y值
   .attr("y", function(d){
       return h - d * 4;
   })
   .attr("width", function(d, i){
       if (averLen > barPadding){
           return averLen - barPadding;
       } else {
          return 0; 
       }
   })
//   柱子是倒着的，这是svg的特性，我们用div就没有这种事
   .attr("height", function(d){
       return d * 4;
   })
   .attr("fill", function(d){
       return "rgb(0, 0, " + (d * 10) + ")";
   });
   
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d){
       return d;
   })
   .attr("x", function(d, i){
       return i * (w / dataset.length) + (averLen - barPadding) / 2;
   })
   .attr("y", function(d){
       return h - d * 4 + 15;
   })
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("fill", "white")
   // used for setting the alignment of text relative to a given point (here x)
   .attr("text-anchor", "middle");