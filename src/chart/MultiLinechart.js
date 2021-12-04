import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import SelectDataTable from "../component/SelectDataTable";

const MultiLinechart = (props) => {
  const { data, height, width, margin, rawdata } = props;
  const [datex0, setDatex0] = useState("");
  const [datex1, setDatex1] = useState("");
  useEffect(() => {
    if (data.length > 0) {
      drawChart();
    }
  }, [data]);

  const drawChart = () => {
    //format date to string
    const formatDate = (datetime) =>
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

    // const reformatDate = (datetime) =>
    //   datetime.getFullYear() +
    //   "-" +
    //   (datetime.getMonth() + 1) +
    //   "-" +
    //   datetime.getDate() +
    //   "  " +
    //   datetime.getHours() +
    //   ":" +
    //   datetime.getMinutes() +
    //   ":" +
    //   datetime.getSeconds();

    const reformatDate = (datetime) =>
      datetime.getFullYear() + "-" + (datetime.getMonth() + 1);

    const container = d3.select("#container");
    //color line
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const curve = d3.curveLinear;
    //setting up svg
    const svg = d3.select("svg");

    //setting the scaling
    const x = d3
      .scaleTime()
      .domain(d3.extent(data[0].values, (d) => d.date))
      .range([margin.left, width - 500]);

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
        [width - 500, height - margin.bottom],
      ])
      .on("start brush end", brushed);

    function brushed({ selection }) {
      if (selection == null) {
        lines.attr("stroke", (data) => color(data));
        d3.selectAll(".selected_date").remove();
        setDatex0("");
        setDatex1("");
      } else {
        const [x0, x1] = selection.map(x.invert);
        // console.log("x0 : " + x0 + "| x1 : " + x1);
        const selectdate = "Date : " + formatDate(x0) + " - " + formatDate(x1);
        setDatex0(reformatDate(x0));
        setDatex1(reformatDate(x1));
        // const brushData = data.map(({ col, values }) => {
        //   return {
        //     col,
        //     values: values.filter(
        //       ({ date }) =>
        //         date.getTime() >= x0.getTime() && date.getTime() <= x1.getTime()
        //     ),
        //   };
        // });
        //select date tool
        d3.selectAll(".selected_date").remove();
        const select_date = details
          .append("div")
          .style("padding-left", `${margin.left}px`)
          .attr("class", "selected_date");

        select_date.append("p").text(selectdate);
        lines.attr("stroke", "rgba(0, 0, 0, 0.171)");
      }
    }

    //legend
    const legend = svg.append("g").attr("class", "legend");
    legend
      .selectAll(".line")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", width - 450)
      .attr("cy", (d, i) => margin.top + 10 + i * 25)
      .attr("r", 7)
      .style("fill", (d) => color(d));

    legend
      .selectAll(".lines")
      .data(data)
      .enter()
      .append("text")
      .attr("x", width - 430)
      .attr("y", (d, i) => margin.top + 10 + i * 25)
      .style("fill", (d) => color(d))
      .text((data) => data.col)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    //call d3 tools
    svg.append("g").attr("class", "brush").call(brush);

    //other tools
    const details = d3
      .select("#details")
      .append("div")
      .attr("class", "details");

    d3.select("#table_datagrid").style(
      "padding",
      "20px " + `${margin.left}` + "px"
    );
  };
  return (
    <div id="container">
      <svg width={width} height={height} id="multi"></svg>
      <div id="details"></div>
      <div id="table_datagrid">
        <SelectDataTable
          rawdata={rawdata}
          x0={datex0}
          x1={datex1}
        ></SelectDataTable>
      </div>
    </div>
  );
};
export default MultiLinechart;
