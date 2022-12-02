import React, { useEffect, memo, useMemo } from "react";
import * as d3 from "d3";

const Test = () => {
  var svg = d3
    .select("#test")
    .append("svg")
    .attr("width", "400")
    .attr("height", "400")
    .style("border", "solid 1px");

  var dragHandler = d3.drag().on("drag", dragged);
  // .on('start', dragstarted);

  var circle = svg.append("circle").attr("cx", 50).attr("cy", 50).attr("r", 20);

  dragHandler(circle);

  function dragged(event) {
    var current = d3.select(this);
    current.attr("cx", event.x).attr("cy", event.y);
  }
  return <div id="test"></div>;
};
export default Test;
