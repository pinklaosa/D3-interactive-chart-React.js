import React, { useEffect, memo, useMemo } from "react";
import * as d3 from "d3";

const Tur = () => {
  d3.select("svg").remove();

  //   function drag() {
  //     function dragStarted(event, d) {
  //       d3.select(this).attr("x", event.x).attr("y", event.y);
  //     }
  //     return d3.drag().on("drag", dragStarted);
  //   }

  //circle -> svg ->
  let svg = d3
    .select("#circle")
    .append("svg")
    .attr("width", 200)
    .attr("height", 200);

  svg
    .append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 100)
    .attr("stroke", "black")
    .attr("fill", "#69a3b2");

  //#motor -> svg -> [ rect ]
  //svg
  let svgMotor = d3.select("#motor").append("svg").attr("id", "svg-motor");

  //viewBox="0 0 150 70" fill="none"
  let svgMotorVB = svgMotor.attr("viewBox", "0 0 150 70").attr("fill", "none");
  //<rect width="15" height="14.5" x="82" y="20" rx="0.5" ry="3" stroke="#7B7B7B" stroke-width="0.5" fill="#B3B3B3" />
  let insertRectInSvgMotor = svgMotorVB
    .append("rect")
    .attr("width", 15)
    .attr("height", 14.5)
    .attr("x", 82)
    .attr("y", 20)
    .attr("rx", 0.5)
    .attr("ry", 3)
    .attr("stroke", "#7B7B7B")
    .attr("stroke-width", 0.5)
    .attr("fill", "#B3B3B3");

  let dragHandler = d3
    .drag()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnd);

  dragHandler(insertRectInSvgMotor);

  function dragStarted(event) {
    let c = d3.select(this);
    c.attr("fill", "white");
    // c.attr("x", event.x).attr("y", event.y);
  }

  function dragged(event) {
    let c = d3.select(this);
    c.attr("x", event.x).attr("y", event.y);
  }

  function dragEnd(event) {
    let c = d3.select(this);
    c.attr("fill", "#B3B3B3");
  }
  return (
    <>
      <div id="motor"></div>
      <div id="circle"></div>
    </>
  );
};
export default Tur;
