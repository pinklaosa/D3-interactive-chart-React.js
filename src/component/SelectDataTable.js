import { DataGrid } from "@material-ui/data-grid";
import React, { useRef, memo, useState } from "react";
import * as d3 from "d3";

const SelectDataTable = (props) => {
  const { rawdata, x0, x1, listDate } = props;
  const [rowsData, setRowsData] = useState([]);
  const renders = useRef(0);
  const parseDate = d3.timeParse("%Y-%m");
  //   const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
  //   console.log(parseDate(x0));
  //   console.log(parseDate(x1));
  const colsData = rawdata.columns.map((d) => {
    return {
      field: d,
      headerName: d,
      width: 160,
    };
  });

  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
    },
    ...colsData,
  ];

  let rows = [];

  if (listDate) {

  } else {
    const rawrows = rawdata.map((d, index) => {
      const dx0 = parseDate(x0);
      const dx1 = parseDate(x1);
      const timestamp = parseDate(d.Date);
      return {
        id: index + 1,
        CheckTimeStamp:
          x0 !== "" && x1 !== ""
            ? timestamp.getTime() >= dx0.getTime() &&
              timestamp.getTime() <= dx1.getTime()
            : false,
        ...d,
      };
    });
    rows = rawrows.filter((r) => r.CheckTimeStamp == true);
  }

  return (
    <div style={{ height: 600, width: "100%" }}>
      <div> SelectDataTable.js renders : {renders.current++}</div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={50}
        disableSelectionOnClick
      />
    </div>
  );
};
export default memo(SelectDataTable);
