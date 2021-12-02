import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";

const SimpleDataGrid = (props) => {
  const { data, rawdata } = props;
  const colsData = rawdata.columns.map((d) => {
    return {
      field: d,
      headerName: d,
      width: 200,
    };
  });

  const columns = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "Date",
      headerName: "Date",
      width: 200,
    },
    ...colsData,
  ];
  const rows = rawdata.map((d,index)=>{
    return{
      id:index+1,
      ...d,
    }
  });
  console.log(rows);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          disableSelectionOnClick
        />
    </div>
  );
};
export default SimpleDataGrid;
