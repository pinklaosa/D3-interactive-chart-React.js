import React, { useEffect } from "react";
import * as d3 from "d3";

const MultiLinechart = (props) => {
  const { data, height, width, margin } = props;
  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    //color line
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const curve = d3.curveLinear;
    //setting up svg
    const svg = d3
      .select("#multi")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //setting the scaling
    const x = d3
      .scaleTime()
      .domain(d3.extent(data[0].values, (d) => d.date))
      .range([margin.left, width-100]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d3.min(d.values, (v) => v.vSensor)),
        d3.max(data, (d) => d3.max(d.values, (v) => v.vSensor)),
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

    //plot line from the data
    const line = d3
      .line()
      .curve(curve)
      .x((data) => x(data.date))
      .y((data) => y(data.vSensor));

    const lines = svg
      .selectAll("lines")
      .data(data)
      .enter()
      .append("g")
      .append("path")
      .attr("fill", "none")
      .attr("class", "line")
      .attr("stroke", (d) => color(d))
      .attr("d", (data) => line(data.values));

    //brush tool
    const brush = d3
    .brushX()
    .extent([
      [margin.left, margin.top],
      [width -100, height - margin.bottom],
    ])
    .on("start brush end", brushed);

    function brushed({ selection }) {
      if (selection == null) {
        lines.attr("stroke", (data) => color(data));
      } else {
        const [x0, x1] = selection.map(x.invert);
        const brushData = data.map(({ col, values }) => {
          return {
            col,
            values: values.filter(
              ({ date }) =>
                date.getTime() >= x0.getTime() && date.getTime() <= x1.getTime()
            ),
          };
        });
        lines.attr("stroke", "rgba(0, 0, 0, 0.171)");
      }
    }

    //call tool
    svg.append("g").attr("class", "brush").call(brush);
  };

  return <div id="multi"></div>;
};
export default MultiLinechart;
