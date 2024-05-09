import { Box, IconButton, Snackbar, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { BASE_URL, USERID } from "../../config/config";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
const Manage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertProps["severity"]>("success"); // Specify the type of severity prop
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(BASE_URL + "/bot/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete bot");
      }
      //@ts-ignore
      setRows((prevRows) => prevRows.filter((row) => row.id !== id)); // Remove deleted bot from rows state
      setSnackbarSeverity("success");
      setSnackbarMessage("Bot deleted successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting bot:", error);
      setSnackbarSeverity("error");
      setSnackbarMessage("Failed to delete bot");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
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
      flex: 1.5,
      valueGetter: (params: any) => params.row.deployment?.domain || "", // Access nested property safely
    },
    {
      field: "success_url",
      headerName: "Success Url",
      flex: 1,
    },

    // {
    //   field: "customersupport_telegram",
    //   headerName: "Support",
    //   flex: 1,
    // },

    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
      valueGetter: (params: any) => {
        const date = new Date(params.value);
        return date.toISOString().split("T")[0];
      },
    },
    {
      field: "actions",
      headerName: "Delete",
      flex: 1,
      renderCell: (params: any) => (
        <IconButton aria-label="delete" onClick={() => handleDelete(params.id)}>
          <DeleteOutlineIcon />
        </IconButton>
      ),
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(`${process.env.REACT_APP_BASEURL}/customers/user/79eb44a9-8745-4a15-af1d-12c6bd3d4aeb`);
        const response = await fetch(BASE_URL + "/bot/user/" + USERID);
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
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box  mr={isMobile ? "1vw" : "0.5vw"} ml={isMobile ? "1vw" : "17.5vw"}>
      <Header title="MANAGE BOTS" subtitle="List of deployed bots" />
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
          
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
            borderBottom: `1px solid ${colors.grey[500]}`, // Add a border to separate cells
            padding: "7px", // Add7 padding to column headers and cells
          },
          ...(isMobile && {
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: colors.blueAccent[700],
              whiteSpace: "normal",
              overflow: "hidden", 
              textOverflow: "ellipsis",
            },
            '@media (hover: none)': {
              '&& .MuiDataGrid-menuIcon': {
                width: 0,
                visibility: 'hidden',
              },
              '&& .MuiDataGrid-sortIcon': {
                width: 0,
                visibility: 'hidden',
              }
            },
            '&& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-menuIcon': {
              width: '25px',
              visibility: 'visible',
            },
            '&& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon': {
              width: 'auto',
              visibility: 'visible',
            }
          }),
        }}
      >
        {" "}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
        <DataGrid
        
          checkboxSelection
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          sx={{
            fontSize:isMobile?"9px":"12px"
          }}
        />
      </Box>
    </Box>
  );
};

export default Manage;
