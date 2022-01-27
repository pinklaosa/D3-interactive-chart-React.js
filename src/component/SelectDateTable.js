import { DataGrid } from "@material-ui/data-grid";
import Radio from "@material-ui/core/Radio";
import React, { useRef, useState,memo } from "react";
import * as d3 from "d3";

const SelectDateTable = ({ rows, sendDate }) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectedRows,setSelectedRows] = useState([]);
  const renders = useRef(0);
  const columns = [
    {
      field: "id",
      headerName: "ID",
      hide: true,
    },
    {
      field: "start",
      headerName: "Start",
      width: 130,
    },
    {
      field: "end",
      headerName: "End",
      width: 130,
    },
  ];

  // sendDate(selectionModel)
  return (
    <div style={{ height: 600, width: "100%" }}>
      <div> SelectDate.js renders : {renders.current++}</div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={20}
        hideFooterPagination
        checkboxSelection
        disableSelectionOnClick
        selectionModel={selectionModel}
        onSelectionModelChange={(ids) => {
          setSelectionModel(ids);
          sendDate(ids,rows);
        }}
      />
      <pre style={{ fontSize: 10 }}>
        {JSON.stringify(selectionModel, null, 4)}
      </pre>
    </div>
  );
};
export default memo(SelectDateTable);
