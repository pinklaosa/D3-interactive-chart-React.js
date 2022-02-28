import React, { useEffect, memo } from "react";
import * as d3 from "d3";
import { scaleTime, select } from "d3";

function Linechart(props) {
  const { data, width, height, margin, pullX01, points, brushScatter } = props;
  // console.log(data);
  useEffect(() => {
    drawChart();
  }, [data, points, brushScatter]);

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
      .domain(d3.extent(data[0].values, (d) => d.date))
      .range([margin.left, width]);

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

    const line = d3
      .line()
      .x((data) => x(data.date))
      .y((data) => y(data.vSensor))
      .curve(curve);

    const lines = svg.selectAll("lines").data(data).enter().append("g");

    const mainLine = () => {
      lines
        .append("path")
        .attr("fill", "none")
        .attr("class", "line")
        .transition()
        .duration(2000)
        .attr("id", (d) => d.col)
        .attr("stroke", color())
        .attr("stroke-width", "1.5px")
        .attr("d", (data) => line(data.values));

      lines
        .selectAll(".points")
        .data((d) => d.values)
        .enter()
        .append("circle")
        .attr("class", "points")
        .attr("r", 3)
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.vSensor))
        .style("fill", color());
    };

    if (brushScatter == true) {
      // const TimeStamp = points.map((p) => parseDate(p["TimeStamp"]).getTime());
      // const health = data.filter(d => d.col == "HEALTH");
      // const selectedData = health[0].values.map((d,i)=>{
      //   return{
      //     checkSelect : TimeStamp.includes(d.date.getTime()),
      //     ...d,
      //   }
      // })
      // const reData = selectedData.filter((s)=> s.checkSelect == true);
      const reSimple = points.map(({ TimeStamp, HEALTH }) => {
        return {
          Date: parseDate(TimeStamp),
          HEALTH,
        };
      });
      console.log(reSimple);
      svg.selectAll(".points").remove();
      // const reData = data["values"].filter(v => TimeStamp.includes(v.date.getTime()));
      lines
        .selectAll(".points")
        .data(reSimple)
        .enter()
        .append("circle")
        .attr("class", "points")
        .attr("r", 3)
        .attr("cx", (d) => x(d.Date))
        .attr("cy", (d) => y(d.HEALTH))
        .style("fill", color());
    } else if (brushScatter == false) {
      mainLine();
    }

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
          d.values.filter(
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
        .attr("cy", (d) => y(d.vSensor))
        .style("fill", color());
    }
    function brushed({ selection }) {
      if (selection == null) {
        pullX01("", "");
        mainLine();
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
          line(data.values.filter((d) => d.date.getTime() <= x0.getTime()))
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

    svg.append("g").attr("class", "brush").call(brush);
  };

  return <div id="linechart"></div>;
}
export default memo(Linechart);
