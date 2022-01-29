import React, { useEffect, useState, memo, useRef, useMemo } from "react";
import { useToggle } from "rooks";
import * as d3 from "d3";

const MultiLinechart = (props) => {
  const { data, height, width, margin, brushToolCheck, listDate, pullX1 } =
    props;

  const renders = useRef(0);

  // console.log("Multiline Comp : " + brushToolCheck);

  //d3 function Parse date to datetime
  const parseDate = d3.timeParse("%Y-%m");

  //Change formatdate to String
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

  //Reformatdate datetime to String
  const reformatDate = (datetime) =>
    datetime.getFullYear() + "-" + (datetime.getMonth() + 1);

  useEffect(() => {
    drawChart();
  }, [data, brushToolCheck, listDate]);

  const drawChart = () => {
    // console.log("drawChart Func : " + brushToolCheck);

    d3.select("svg").remove();

    // console.log(listDate);
    const l = d3
      .select("#multilinechart")
      .append("svg")
      .attr("height", height)
      .attr("width", width);

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
      .x((data) => x(data.date))
      .y((data) => y(data.vSensor));

    const lines = svg.selectAll("lines").data(data).enter().append("g");

    const mainLine = () => {
      lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .transition()
        .duration(2000)
        .attr("id", (d) => d.col)
        .attr("stroke", (d) => color(d))
        .attr("stroke-width", "1.5px")
        .attr("d", (data) => line(data.values));
    };
    if (brushToolCheck == "on") {
      mainLine();
    }
    //brush tool
    const brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [width - 500, height - margin.bottom],
      ])
      .on("start brush", brushing)
      .on("end", brushed);

    function brushing({ selection }) {
      const [x0, x1] = selection.map(x.invert);
      // console.log("x0 : " + x0 + "| x1 : " + x1);
      const selectdate = "Date : " + formatDate(x0) + " - " + formatDate(x1);
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
      d3.selectAll(".line").remove();
      brushLine(x0, x1);
    }

    function brushed({ selection }) {
      if (selection == null) {
        lines.attr("stroke", (data) => color(data));
        d3.selectAll(".selected_date").remove();
        pullX1("", "");
        d3.selectAll(".line").remove();
        mainLine();
      } else {
        const [x0, x1] = selection.map(x.invert);
        pullX1(reformatDate(x0), reformatDate(x1));
      }
    }

    const brushLine = (x0, x1) => {
      const line1 = lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("stroke", "rgba(0, 0, 0, 0.171)")
        .attr("d", (data) =>
          line(data.values.filter((d) => d.date.getTime() <= x0.getTime()))
        );

      const line2 = lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .attr("id", (d) => "line-highlight-" + d.col)
        .attr("stroke-width", "3px")
        .attr("stroke", (d) => color(d))
        .attr("d", (data) =>
          line(
            data.values.filter(
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
          line(data.values.filter((d) => d.date.getTime() >= x1.getTime()))
        );
    };

    //select highlight line Func
    const selectedLine = (listDate) => {
      let sectionLine = listDate.length * 2 + 1;
      if (listDate.length == 1) {
        const x0 = parseDate(listDate[0].start);
        const x1 = parseDate(listDate[0].end);
        brushLine(x0, x1);
      } else if (sectionLine > 1) {
        console.log("sectionLine : " + sectionLine);
        let i = 0;
        for (let index = 0; index < sectionLine; index++) {
          if (index % 2 == 0 && index != 0) {
            const x0 = parseDate(listDate[i].start);
            const x1 = parseDate(listDate[i].end);
            console.log(i + " : " + index);
            const lineHighlight = lines
              .append("path")
              .attr("fill", "none")
              .attr("class", "line")
              .attr("id", (d) => "line-highlight-" + d.col)
              .attr("stroke-width", "3px")
              .attr("stroke", (d) => color(d))
              .attr("d", (data) =>
                line(
                  data.values.filter(
                    (d) =>
                      d.date.getTime() >= x0.getTime() &&
                      d.date.getTime() <= x1.getTime()
                  )
                )
              );
            i++;
          }else if(index%2 == 1){
            
          }

        }
      }
    };

    if (brushToolCheck == "off") {
      selectedLine(listDate);
    }

    //zoom
    const extent = [
      [margin.left, margin.top],
      [width - margin.right, height - margin.top],
    ];

    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent(extent)
      .extent(extent)
      .on("zoom", zoomed);

    function zoomed(event) {
      const xz = event.transform.rescaleX(x);
      const zoomLine = line.x((data) => xz(data.date));
      svg.selectAll(".line").attr("d", (data) => zoomLine(data.values));
      svg.select(".axis--x").call(d3.axisBottom(xz));
    }

    //legend
    const legend = svg.append("g").attr("class", "legend");
    legend
      .selectAll(".line")
      .data(data)
      .enter()
      .append("circle")
      .attr("name", (data) => data.col)
      .attr("class", "circle-legend")
      .attr("cx", width - 450)
      .attr("cy", (d, i) => margin.top + 10 + i * 25)
      .attr("r", 7)
      .style("fill", (d) => color(d))
      .on("mouseover", function (e) {
        //Line Highlight
        svg.selectAll(".circle-legend").style("fill", "rgba(0, 0, 0, 0.171)");
        d3.select(this)
          .style("fill", (d) => color(d))
          .attr("r", "10");
        const name = d3.select(this).attr("name");
        svg.selectAll(".line").attr("stroke", "rgba(0, 0, 0, 0.171)");
        svg
          .selectAll("#" + name)
          .attr("stroke", (d) => color(d))
          .attr("stroke-width", "3px");
        svg.selectAll(".text-legend").style("fill", "rgba(0, 0, 0, 0.171)");
        svg
          .selectAll("#text-legend-" + name)
          .style("font-weight", "900")
          .style("fill", (d) => color(d));
      })
      .on("mouseout", function (e) {
        //Line default
        svg.selectAll(".circle-legend").style("fill", (d) => color(d));
        d3.select(this)
          .style("fill", (d) => color(d))
          .attr("r", "7");
        svg
          .selectAll(".line")
          .attr("stroke", (d) => color(d))
          .attr("stroke-width", "1.5px");
        svg
          .selectAll(".text-legend")
          .style("font-weight", "400")
          .style("fill", (d) => color(d));
      });

    legend
      .selectAll(".lines")
      .data(data)
      .enter()
      .append("text")
      .attr("id", (data) => "text-legend-" + data.col)
      .attr("class", "text-legend")
      .attr("x", width - 430)
      .attr("y", (d, i) => margin.top + 10 + i * 25)
      .style("fill", (d) => color(d))
      .style("font-weight", "400")
      .text((data) => data.col)
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    //call d3 tools
    if (brushToolCheck == "on") {
      svg.append("g").attr("class", "brush").call(brush);
    } else if (brushToolCheck == "off") {
      d3.selectAll(".brush").remove();
      d3.selectAll(".selected_date").remove();
    }
    // svg.append("g").attr("class", "brush").call(brush);
    // svg.call(zoom);

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

  // drawChart(data);

  return (
    <>
      <div> Multiline.js renders : {renders.current++}</div>
      <div id="multilinechart"></div>
    </>
  );
};
export default memo(MultiLinechart);
