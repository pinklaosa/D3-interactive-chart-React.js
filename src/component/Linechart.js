import React, { useEffect } from "react";
import * as d3 from "d3";

function Linechart(props) {
  const { data, width, height } = props;
  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    //setting up svg
    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom);
    // .append("g")
    // .attr("transform", `translate(${margin.left},${margin.top})`);

    //setting the scaling
    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d)])
      .range([height - margin.bottom, margin.top]);

    //plot line from the data
    const line = d3
      .line()
      .x((d, i) => x(i))
      .y((d) => y(d))
      .curve(d3.curveCardinal);

    //setting up the axes
    const xAxis = svg
      .append("g")
      .attr("class", "axis--x")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    const yAxis = svg
      .append("g")
      .attr("class", "axis--y")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    //setting up the data for the svg
    svg
      .selectAll(".line")
      .data([data])
      .enter()
      .append("g")
      .attr("class", "line")
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#f6c3d0")
      .attr("d", (d) => line(d));
  };
  return <div id="container"></div>;
}
export default Linechart;
