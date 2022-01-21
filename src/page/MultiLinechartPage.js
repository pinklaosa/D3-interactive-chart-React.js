import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import SelectDataTable from "../component/SelectDataTable";
import Grid from "@material-ui/core/Grid";
import SelectDateTable from "../component/SelectDateTable";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import MultiLinechart from "../chart/MultiLinechart";

const useStyles = makeStyles((theme) => ({
  btnselect: {
    marginLeft: 50,
  },
}));

const MultiLinechartPage = (props) => {
  const classes = useStyles();
  const { data, rawdata, height, width, margin } = props;

  const [datex0, setDatex0] = useState("");
  const [datex1, setDatex1] = useState("");
  const [listDate, setListDate] = useState();
  const [rowsDate, setRows] = useState([]);
  const [brushToolCheck, setBrushToolCheck] = useState("on");

  const pullX01 = (x0, x1) => {
    setDatex0(x0);
    setDatex1(x1);
  };
  
  const sendDate = (val) => {
    if (val.length > 0) {
      setBrushToolCheck("off");
      // setListDate(val);
      let listSelected = val.map((v) => rowsDate.filter((r) => r.id == v));
      console.log(listSelected);
    } else {
      setBrushToolCheck("on");
    }
  };
  return (
    <div id="container">
      <MultiLinechart
        data={data}
        height={height}
        width={width}
        margin={margin}
        brushToolCheck={brushToolCheck}
        pullX01={pullX01}
      ></MultiLinechart>
      <Grid container spacing={3}>
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="primary"
            className={classes.btnselect}
            id="btnselection"
            onClick={() => {
              let listDate = [
                ...rowsDate,
                { id: rowsDate.length + 1, start: datex0, end: datex1 },
              ];
              setRows(listDate);
            }}
          >
            Select
          </Button>
        </Grid>
        <Grid>
          <div id="details"></div>
        </Grid>
      </Grid>
      <div id="table_datagrid">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <SelectDateTable
              rows={rowsDate}
              sendDate={sendDate}
            ></SelectDateTable>
          </Grid>
          <Grid item xs={9}>
            <SelectDataTable
              rawdata={rawdata}
              x0={datex0}
              x1={datex1}
            ></SelectDataTable>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default MultiLinechartPage;