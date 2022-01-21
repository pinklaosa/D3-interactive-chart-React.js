import { DataGrid } from "@material-ui/data-grid";
import Radio from "@material-ui/core/Radio";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const SelectDateTable = ({ rows, sendDate }) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const [selectedRows,setSelectedRows] = useState([]);
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

  return (
    <div style={{ height: 600, width: "100%" }}>
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
        }}
      />
      {
        sendDate(selectionModel)
      }
      <pre style={{ fontSize: 10 }}>
        {JSON.stringify(selectionModel, null, 4)}
      </pre>
    </div>
  );
};
export default SelectDateTable;
