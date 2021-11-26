import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";

function Linechart(props) {
  const { data, width, height } = props;
  useEffect(() => {
    drawChart();
  }, [data]);

  const drawChart = () => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    
  };

  return <div id="container"></div>;
}
export default Linechart;
