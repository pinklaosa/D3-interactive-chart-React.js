import React, { useEffect } from "react";
import * as d3 from "d3";

const ChangeLineColor = () => {
  useEffect(() => {
    const data = [
      { x: 1, y: 5 },
      { x: 20, y: 20 },
      { x: 40, y: 10 },
      { x: 60, y: 40 },
      { x: 80, y: 5 },
      { x: 100, y: 60 },
      { x: 120, y: 15 },
      { x: 140, y: 40 },
      { x: 160, y: 25 },
      { x: 180, y: 20 },
      { x: 200, y: 15 },
      { x: 220, y: 80 },
      { x: 240, y: 35 },
      { x: 260, y: 60 },
    ];
    drawChart(data);
  }, []);

  const drawChart = (data) => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 1000;
    const height = 500;
    //setting up svg
    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom);

    //setting the scaling
    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x)])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .range([height - margin.bottom, margin.top]);

    //plot line from the data
    const line = d3
      .line()
      .x((d) => x(d.x))
      .y((d) => y(d.y))

    //setting up the axes
    svg
      .append("g")
      .attr("class", "axis--x")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("g")
      .attr("class", "axis--y")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const datal = svg
      .selectAll(".line")
      .data([data])
      .enter()
      .append("g")
      .attr("class", "line");

    //setting up the data for the svg
    const line1 = datal
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", line(data.filter((d) => d.x < 120)));

    const line2 = datal
      .append("path")  
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("d", line(data.filter((d) => d.x >= 100)));

    const line3 = datal
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", line(data.filter((d) => d.x > 200)));
  };
  return <div id="container"></div>;
};
export default ChangeLineColor;
