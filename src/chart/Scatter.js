import React, { useEffect, useState, memo, useRef, useMemo } from "react";
import * as d3 from "d3";

const Scatter = (props) => {
  const { data, height, width, margin, x0, x1 } = props;
  const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S+%H:%M");
  console.log(data);
  useEffect(() => {
    plotChart();
  }, [data, x0, x1]);

  const plotChart = () => {
    //  console.log("Date : " + x0 + " - " + x1);
    d3.select("#scatterplotSVG").remove();
    //setting up svg
    const buildSVG = d3
      .select("#scatterplot2")
      .append("svg")
      .attr("id", "scatterplotSVG")
      .attr("height", height)
      .attr("width", width);

    const svg = d3.select("#scatterplotSVG");
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const columnsCsv = Object.keys(data[0]);

    // console.log(d3.max(data, (d) => d[columnsCsv[1]]));
    //setting the scaling
    const x = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d[columnsCsv[1]]),
        d3.max(data, (d) => d[columnsCsv[1]]),
      ])
      .range([margin.left, width]);

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

    const scatterPoint = (dataPoint, r, opacity, colorPoint) => {
      const circles = svg
        .selectAll("circle")
        .data(dataPoint)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(d[columnsCsv[1]]))
        .attr("cy", (d) => y(d[columnsCsv[2]]))
        .attr("r", r)
        .attr("fill-opacity", opacity)
        .attr("fill", colorPoint);
    };

    //plot circles
    if (x0 != "" && x1 != "") {
      const rawrows = data.map((d) => {
        const timestamp = parseDate(d[columnsCsv[0]]);
        return {
          ...d,
          CheckTime:
            x0 !== "" && x1 !== ""
              ? timestamp.getTime() >= x0.getTime() &&
                timestamp.getTime() <= x1.getTime()
              : false,
        };
      });
      const hightlightCircles = rawrows.filter((r) => r.CheckTime == true);
      const noHightlightCircles = rawrows.filter((r) => r.CheckTime == false);
      scatterPoint(hightlightCircles, 3, 0.7, color());
      scatterPoint(noHightlightCircles, 1.5, 0.7, "rgba(0, 0, 0, 0.171)");
    } else if (x0 === "" || x1 === "") {
      scatterPoint(data, 3, 0.7, color());
    }
  };

  return <div id="scatterplot2"></div>;
};
export default memo(Scatter);