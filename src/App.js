import React, { useState, useEffect, useMemo, useRef } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as d3 from "d3";
import Linechart from "./chart/Linechart";
import MultiLinechartPage from "./page/MultiLinechartPage";
import Navbar from "./component/Navbar";
import SimpleDataGrid from "./component/SimpleDataGrid";
import ChangeLineColor from "./chart/ChangeLineColor";
import Grid from "@material-ui/core/Grid";
import ScatterPage from "./page/ScatterPage";
import SimpleScatter from "./chart/SimpleScatter";

function App() {
  const [data, setData] = useState([]);
  const [dataS, setDataS] = useState([]);
  const [rawdata, setRawdata] = useState([]);
  const [rawdataS, setRawdataS] = useState([]);
  const parseDate = d3.timeParse("%Y-%m");
  const parseDate2 = d3.timeParse("%Y-%m-%d %H:%M:%S+%H:%M");
  const renders = useRef(0);
  const gridContainer = {
    display: "grid",
    grid: "auto /auto auto",
    gridGap: "10px",
    contentAlign: "left",
  };
  const gridItems = {
    padding: "0 50px",
    textAlign: "start",
  };
  // const csvDataD3 = useMemo(()=> csvData(),[])
  useEffect(() => {
    d3.csv("data/data-extant.csv").then((d) => {
      setRawdata(d);
      const loaddata = d.columns.slice(1).map((sensor) => {
        return {
          col: sensor,
          values: d.map((v) => {
            return {
              date: parseDate(v.Date),
              vSensor: +v[sensor],
            };
          }),
        };
      });
      setData(loaddata);
    });
    d3.csv("data/MasterTable/2022_26.csv").then((d) => {
      setRawdataS(d);
      const loaddata = d.columns.slice(5).map((sensor) => {
        return {
          col: sensor,
          values: d.map((v) => {
            return {
              date: parseDate2(v.TimeStamp),
              vSensor: +v[sensor],
            };
          }),
        };
      });
      setDataS(loaddata);
    });
  }, []);

  return (
    <div className="App">
      {/* <div> App.js renders : {renders.current++}</div> */}
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <h1>Home</h1>
          </Route>
          {/* <Route path="/simpleline">
            <Linechart
              data={[10, 20, 80, 5, 60, 30, 40, 50]}
              width={1000}
              height={500}
            />
          </Route> */}
          <Route path="/multiline">
            <MultiLinechartPage
              data={data}
              height={550}
              width={1500}
              margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
              rawdata={rawdata}
            ></MultiLinechartPage>
          </Route>
          <Route path="/scatter">
            <ScatterPage
              data={dataS}
              rawdata={rawdataS}
              height={600}
              width={600}
              margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
            ></ScatterPage>
          </Route>
          {/* <Route path="/simpledatagrid">
            <SimpleDataGrid
              data={data}
              rawdata={rawdata}
            ></SimpleDataGrid>
          </Route> */}
          <Route path="/simplescatter">
            <SimpleScatter
              data={rawdataS}
              height={600}
              width={600}
              margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
            ></SimpleScatter>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
export default App;
