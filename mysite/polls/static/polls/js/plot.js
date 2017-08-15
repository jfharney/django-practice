PARTYNET.func = function (data) {
  console.log("test func");
}




/*








PARTYNET.make_network = function (json_location) {

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var xScale = d3.scaleLinear()
              .domain([0, width])
              .range([0, width]);

var yScale = d3.scaleLinear()
              .domain([0, height])
              .range([0, height]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(100).strength(1))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

var attractForce = d3.forceManyBody().strength(20).distanceMax(500).distanceMin(60);
var repelForce = d3.forceManyBody().strength(-200).distanceMax(100).distanceMin(100);

var link, nodes, legend;
var shiftKey;

var infobox = d3.select("body")
    .append("div") 
    .attr("class", "tooltip")             
    .style("opacity",0);


//console.log("before the d3");

//var json_location = 'http://localhost:8080/partynet/network_response/';
//var json_location = PARTYNET.config.temp_data_addr;

d3.json(json_location, function(error, graph) {
  if (error) throw error;

  link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
      .attr("stroke-width", "1.5px");

  nodes = svg.append("g")
                .attr("class", "nodes")
                .selectAll(".node")
                .data(graph.nodes)
                .enter()
                .append("g")
                .attr("class", "node");

  var groups = [];
  graph.nodes.forEach(function(d){
    if (!(groups.includes(d.group))) {
      groups.push(d.group);
    }
  });

  function fontawesome_mapping(number){
    switch(number) {
      case 1:
        return "\uf0d6"
      case 2:
        return "\uf2c0"
      case 3:
        return "\uf041"
      case 4:
        return "\uf0ac"
      case 5:
        return "\uf0f7"
      case 6:
        return "\uf0e0"
      case 7:
        return "\uf095"
      default:
        return "\uf128"
    }
  };

  function nodetype_mapping(number){
    switch(number) {
      case 1:
        return "Account";
      case 2:
        return "Party";
      case 3:
        return "Zipcode";
      case 4:
        return "State";
      case 5:
        return "City";
      case 6:
        return "Email";
      case 7:
        return "Phone";
      default:
        return "Unknown";
    }
  };
  
  legend = svg.append("g")
              .attr("class", "legend")
              .selectAll(".lnode")
              .data(groups)
              .enter()
              .append("g")
              .attr("class", "lnode")
              .attr("transform", function(d){
                var lx = width - 100;
                var ly = 40*d+20;
                return "translate(" + lx + "," + ly + ")";
              });

  legend.append("circle")
        .attr("r", 15)
        .style("fill", function(d) { return color(d);});

  legend.append("text")
        .attr("class", "licon")
        .attr("text-anchor", "middle")
        .attr("y", ".3em")
        .text(function(d){
          return fontawesome_mapping(d);
        });

  legend.append("text")
        .attr("class", "llabel")
        .attr("text-anchor", "left")
        .attr("x", "25")
        .attr("y", ".3em")
        .text(function(d){
          return nodetype_mapping(d);
        });
  
  nodes.append("circle")
      .attr("r", 15)
      .style("fill", function(d) { return color(d.group); })
      //.style("stroke", function(d) { //return d3.rgb(color(d.group)).darker();
      //  return "#ffffff"; 
      //})
      .on("dblclick", releasenode)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  nodes.append("text")
        .attr("text-anchor", "middle")
        .attr("y", ".3em")
        .text(function(d){
          return fontawesome_mapping(d.group);
        });

  simulation
      .nodes(graph.nodes)
      .force("attractForce", attractForce)
      .force("repelForce",repelForce)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
        //.style("stroke", function(d) { //return color(d.source.group); 
        //  return "#555";
        //})
        //.style("stroke-opacity", .3);

    nodes.attr("transform", function(d, i) {
                  return "translate(" + d.x + "," + d.y + ")";
                });
  }

   var linkedByIndex = {};
      graph.links.forEach(function(d) {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
      });

  function isConnected(a, b) {
        return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index];
      }

  nodes.on("mouseover", function(d) {
        var node = d3.select(this);
        
        nodes.classed("node-active", function(o) {
          return isConnected(d, o) ? true : false;
        });
        node.classed("node-active", true);

        link.classed("link-active", function(o) {
          return o.source === d || o.target === d ? true : false;
        });

        var nodetype = nodetype_mapping(d.group);

        infobox.transition()
              .duration(200)
              .style("opacity", 0.9);

        infobox.html(nodetype+":<br><br><b>"+d.id+"</b>")
            .style("left", (d3.event.pageX+20) + "px")
            .style("top", (d3.event.pageY - 28) + "px");

      })
      .on("mouseout", function(d) {
        var node = d3.select(this);
        nodes.classed("node-active", false);
        link.classed("link-active", false);
        
        infobox.transition()
              .duration(500)
              .style("opacity", 0);
      });


});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  // Disabling the next two lines fixes the node in place upon click
  //d.fx = null;
  //d.fy = null;
}

function releasenode(d) {
  d.fx = null;
  d.fy = null;

}

}

*/