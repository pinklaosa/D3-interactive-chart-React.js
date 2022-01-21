import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as d3 from "d3";
import Linechart from "./chart/Linechart";
import MultiLinechartPage from "./page/MultiLinechartPage";
import Navbar from "./component/Navbar";
import SimpleDataGrid from './component/SimpleDataGrid';
import ChangeLineColor from "./chart/ChangeLineColor";

function App() {
  const [data, setData] = useState([]);
  const [rawdata,setRawdata] = useState([]);
  const parseDate = d3.timeParse("%Y-%m");
  // const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
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
  }, []);
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <h1>Home</h1>
          </Route>
          <Route path="/simpleline">
            <Linechart
              data={[10, 20, 80, 5, 60, 30, 40, 50]}
              width={1000}
              height={500}
            />
          </Route>
          <Route path="/multiline">
            <MultiLinechartPage
              data={data}
              height={550}
              width={1500}
              margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
              rawdata={rawdata}
            ></MultiLinechartPage>
          </Route>
          <Route>
            <ChangeLineColor/>
          </Route>
          {/* <Route path="/simpledatagrid">
            <SimpleDataGrid
              data={data}
              rawdata={rawdata}
            ></SimpleDataGrid>
          </Route> */}
        </Switch>
      </Router>
    </div>
  );
}
export default App;
