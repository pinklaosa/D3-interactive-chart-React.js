import React, { useEffect, useState, memo, useRef, useMemo } from "react";
import * as d3 from "d3";

const Scatter = (props) => {
  const { data, height,width, margin } = props;

  useEffect(() => {
    plotChart();
  }, [data]);

  const plotChart = () => {
    //setting up svg
    const buildSVG = d3
      .select("#scatterplot2")
      .append("svg")
      .attr("height", height)
      .attr("width", "auto");

    const svg = d3.select("svg");
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const columnsCsv = Object.keys(data[0]);

    //setting the scaling
    const x = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d[columnsCsv[1]]),
        d3.max(data, (d) => d[columnsCsv[1]]),
      ])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d[columnsCsv[2]]),
        d3.max(data, (d) => d[columnsCsv[2]]),
      ])
      .range([height - margin.bottom, margin.top]);

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

    //plot circles
    const circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d[columnsCsv[1]]))
      .attr("cy", (d) => y(d[columnsCsv[2]]))
      .attr("r", "3")
      .attr("fill", () => color());
  };

  return <div id="scatterplot2"></div>;
};
export default Scatter;
