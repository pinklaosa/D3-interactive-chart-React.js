import React, { useEffect, memo } from "react";
import * as d3 from "d3";
import { scaleTime, select } from "d3";

function Linechart(props) {
  const {
    data,
    width,
    height,
    margin,
    pullX01,
    points,
    brushScatter,
    tools,
    selectedData,
  } = props;
  // console.log(data);
  useEffect(() => {
    drawChart();
  }, [data, points, brushScatter, tools, selectedData]);

  const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S+%H:%M");
  //Change formatdate to String
  const reformatDate = (datetime) =>
    datetime.getDate() +
    "/" +
    (datetime.getMonth() + 1) +
    "/" +
    datetime.getFullYear() +
    "  " +
    datetime.getHours() +
    ":" +
    datetime.getMinutes() +
    ":" +
    datetime.getSeconds();

  const drawChart = () => {
    d3.select("#linechartSVG").remove();

    // console.log(selectedData);
    //build svg
    const buildSVG = select("#linechart")
      .append("svg")
      .attr("id", "linechartSVG")
      .attr("height", height)
      .attr("width", width);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const curve = d3.curveMonotoneX;
    //setting up svg
    const svg = d3.select("#linechartSVG");

    //setting the scaling
    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([margin.left, width]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.health), d3.max(data, (d) => d.health)])
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

    const line = d3
      .line()
      .x((data) => x(data.date))
      .y((data) => y(data.health))
      .curve(curve);

    const lines = svg.selectAll("lines").data([data]).enter().append("g");

    const mainLine = () => {
      lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("id", "health")
        .attr("stroke", color())
        .attr("stroke-width", "1.5px")
        .attr("d", line);
      lines
        .selectAll(".points")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "points")
        .attr("r", 3)
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.health))
        .style("fill", color());
    };

    if (selectedData.length > 0) {
      const selectPoints = selectedData.map((element,index) => data[element]);
      const notSelectedPoints = data.filter(
        (element, index) => !selectedData.includes(index)
      );
      d3.selectAll(".points").remove();
      lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("id", "health")
        .attr("stroke", "rgba(0, 0, 0, 0.171)")
        .attr("stroke-width", "1.5px")
        .attr("d", line);
      svg
        .selectAll(".points")
        .data(selectPoints)
        .enter()
        .append("circle")
        .attr("class", "points")
        .attr("r", 3)
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.health))
        .style("fill", color());

    } else if (selectedData.length <= 0) {
      mainLine();
    }

    // if (brushScatter == true) {
    //   // const reSimple = points.map(({ TimeStamp, HEALTH }) => {
    //   //   return {
    //   //     Date: parseDate(TimeStamp),
    //   //     HEALTH,
    //   //   };
    //   // });
    //   // // console.log(reSimple);
    //   // svg.selectAll(".points").remove();
    //   // lines
    //   //   .selectAll(".points")
    //   //   .data(reSimple)
    //   //   .enter()
    //   //   .append("circle")
    //   //   .attr("class", "points")
    //   //   .attr("r", 3)
    //   //   .attr("cx", (d) => x(d.Date))
    //   //   .attr("cy", (d) => y(d.HEALTH))
    //   //   .style("fill", color());
    // } else if (brushScatter == false) {
    //   mainLine();
    // }

    //brush tool
    const brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width, height - margin.bottom],
      ])
      .on("start brush", brushing)
      .on("end", brushed);

    function brushing({ selection }) {
      d3.selectAll(".line").remove();
      d3.selectAll(".points").remove();
      const [x0, x1] = selection.map(x.invert);
      brushLine(x0, x1);
      lines
        .selectAll(".points")
        .data((d) =>
          d.filter(
            (v) =>
              v.date.getTime() >= x0.getTime() &&
              v.date.getTime() <= x1.getTime()
          )
        )
        .enter()
        .append("circle")
        .attr("class", "points")
        .attr("r", 3)
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.health))
        .style("fill", color());
    }

    function brushed({ selection }) {
      if (selection == null) {
        pullX01("", "");
        // mainLine();
      } else {
        const [x0, x1] = selection.map(x.invert);
        pullX01(x0, x1);
      }
    }

    //split line sections  from highlight
    const brushLine = (x0, x1) => {
      const line1 = lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "rgba(0, 0, 0, 0.171)")
        .attr("d", (data) =>
          line(data.filter((d) => d.date.getTime() <= x0.getTime()))
        );

      const line2 = lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("id", (d) => "line-highlight-" + d.col)
        .attr("stroke-width", "1px")
        .attr("stroke", color())
        .attr("d", (data) =>
          line(
            data.filter(
              (d) =>
                d.date.getTime() >= x0.getTime() &&
                d.date.getTime() <= x1.getTime()
            )
          )
        );

      const line3 = lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "rgba(0, 0, 0, 0.171)")
        .attr("d", (data) =>
          line(data.filter((d) => d.date.getTime() >= x1.getTime()))
        );
    };

    // if (tools == "brush") {
    //   // console.log(tools);
    //   svg.append("g").attr("class", "brush").call(brush);
    // } else if (tools == "") {
    //   // console.log(tools);
    //   svg.selectAll(".brush").remove();
    //   mainLine();
    // }
    svg.append("g").attr("class", "brush").call(brush);
  };

  return <div id="linechart"></div>;
}
export default memo(Linechart);
