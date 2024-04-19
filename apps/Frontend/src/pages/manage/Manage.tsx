import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { BASE_URL, USERID } from "../../config/config";

const Manage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  const columns = [
     { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      // headerAlign: "center"  as GridAlignment,
      // align: "center" as GridAlignment
    },

    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "deployment.domain",
      headerName: "Domain",
      flex: 1,
      valueGetter: (params:any) => params.row.deployment?.domain || "", // Access nested property safely
    },
    {
      field: "success_url",
      headerName: "Groupchat Link",
      flex: 1,
},

    {
      field: "customersupport_telegram",
      headerName: "Support",
      flex: 1,
    },

    
    {
      field: "createdAt",
      headerName: "Date Created",
      flex: 1,
      valueGetter: (params:any) => {
        const date = new Date(params.value);
        return date.toISOString().split("T")[0];
      },
    },

  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch(BASE_URL+'/bot/user/'+USERID);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        // console.log(data)
        setRows(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Box m="20px" ml="280px"
    >
      <Header
        title="MANAGE BOTS"
        subtitle="List of deployed bots"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Manage;
