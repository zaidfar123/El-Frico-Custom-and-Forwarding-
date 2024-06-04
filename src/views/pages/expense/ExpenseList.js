// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TableCell, TableRow, IconButton, Tooltip, Checkbox, TextField, MenuItem, Collapse, Box, Typography, Table, TableHead, TableBody, CircularProgress } from '@mui/material';
import AxiosServices from "service";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import ExpenseDetailsDialog from "./ExpenseDetailsDialog";
import { useDispatch } from 'react-redux';
import docuemntImage from "assets/images/document.gif"
import { openLoader } from 'store/slices/loadingModal';
import { IconFileDownload } from '@tabler/icons';
import CustomPagination from "ui-component/Pagination";
import CustomTable from "ui-component/CustomTable";
import utilsJS from "utilsJS";
// import ClearanceFilter from "../documents/ClearanceFilter";
import FilterListIcon from '@mui/icons-material/FilterList';
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import Chip from '@mui/material/Chip';
import { useTheme, styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import AutoComplete from 'ui-component/AutoComplete';
import CustomDropdowns from "ui-component/CustomDropdowns";
import FilterWrapper from "ui-component/FilterWrapper";
import { authRoles } from 'routes/authRole/authRoles'
import VisibilityIcon from '@mui/icons-material/Visibility';

var enableRowCheckbox = false;

var FILTER_ = {
  fileNo: "",
  pageNumber: 1,
  pageSize: 20,
  assignedUserID: 0,
  userID: 0,
  customerID: 0
}
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-input.Mui-disabled': {
    background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
    "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
  },
}));

export default function ExpenseList() {

  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useAuth();

  const [list, setList] = useState([]);
  const [dailyFileList, setDailyFileList] = useState([]);
  const [filter, setFilter] = useState(FILTER_);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [page, setPage] = useState(1);
  const [count, settotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setisLoading] = useState(false);
  const [isLoadingFile, setisLoadingFile] = useState(false);
  const [isClear, setisClear] = useState(false)

  const getList = () => {

    setisLoading(true);

    AxiosServices.geDailyExpenseEmpList({ ...filter, pageNumber: page, pageSize: rowsPerPage, assignedUserID: authRoles.all.includes(user.role) ? filter.userID : user.id, fileNo: filter.fileNo == "" ? null : filter.fileNo }).then((res) => {
      let { data, totalCount } = res?.data;

      setisLoading(false);

      if (data) {
        const count = Math.ceil(totalCount / parseInt(rowsPerPage));
        settotalCount(count);
        setList(data);
      }
      else {
        setList([]);
      }
    })
  }

  const getDailyExpenseFileList = (userID) => {

    setisLoadingFile(true);
    setDailyFileList([])

    AxiosServices.getDailyExpenseFileList(
      {
        fileNo: null,
        pageNumber: 0,
        pageSize: 0,
        userID: userID,
        customerID: 0,
        clearingID: 0
      }
    ).then((res) => {
      let { data, totalCount } = res?.data;

      setisLoadingFile(false);                 
      if (data) {
        const updatedList = data.map((row) => { return { ...row, userID}});    
        setDailyFileList(updatedList);
      }
      else {
        setDailyFileList([]);
      }
    })
  }

  useEffect(() => {
    getList()
  }, [page, rowsPerPage, filter])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value));
    setPage(1);
  };

  const columnConfig = [
    { name: 'Employee', col: 'employeeName', amount: false, width: 150, textField: false },
    { name: 'Total Assigned Amount', col: 'assignedAmountTotal', amount: true, width: 180, textField: false },
    { name: 'Approved Expense Amount', col: 'approvedExpenseAmountTotal', amount: true, width: 220, textField: false },
    { name: 'In-hand Amount', col: 'amountInHandTotal', amount: true, width: 180, textField: false },
  ];


  const toggleRow = (rowIndex, row) => {

    // Update the 'list' array by finding the row at the given 'rowIndex' and modifying its 'webocRemarks'
    const updatedList = list.map((row, index) => {
      if (index === rowIndex) {
        if (typeof (row.isOpen) === "undefined") {
          return { ...row, isOpen: true };
        }
        else {
          return { ...row, isOpen: !row.isOpen };
        }
      }
      else{
        return { ...row, isOpen: false };;
      }
    });

    setList(updatedList);
    if(row){
      getDailyExpenseFileList(row.userID)
    }
  };

  const getTableRow = () => {
    return list.map((row, rowIndex) => {
      const isItemSelected = isSelected(row.clearingID);

      return (
        <React.Fragment>
          <TableRow key={rowIndex} hover>
            {enableRowCheckbox && (
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  // indeterminate={selectedRows.length > 0 && selectedRows.length < list.length}
                  checked={isItemSelected}
                  onChange={(event) => handleRowClick(event, row)}
                  disabled={!ApprovalButtons.isEnabled(row.rfpStatus)}
                />
              </TableCell>
            )}
            {columnConfig.map((column, colIndex) => (

              <TableCell key={colIndex} align="left" style={{ minWidth: column.width }}>
                <Typography variant="h6" >
                  {column.amount ? utilsJS.getFormattedAmount(row[column.col]) : row[column.col]}
                </Typography>
              </TableCell>
            ))}
            <TableCell sx={{ pr: 3 }} align="center">

              {typeof (row.isOpen) === "undefined" || !row.isOpen ?

                <Tooltip title={"Show Details"}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => toggleRow(rowIndex, row)}
                  >

                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                      <path d="M9 12h6" />
                      <path d="M12 9v6" />
                    </svg>
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title={"Hide Details"}>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => toggleRow(rowIndex, null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-minus" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M9 12l6 0" />
                    </svg>
                  </IconButton>
                </Tooltip>
              }
            </TableCell>
          </TableRow>
          <CollapseRow key={rowIndex} row={row} theme={theme} setOpen={toggleRow} rowIndex={rowIndex} list={dailyFileList} isLoading={isLoadingFile} />
        </React.Fragment>
      );
    });
  };


  const handleRowClick = (event, row) => {

    let name = row.clearingID

    const selectedIndex = selectedRows.indexOf(name);
    let newSelectedRows = [];

    if (selectedIndex === -1) {
      newSelectedRows = newSelectedRows.concat(selectedRows, name);
    } else if (selectedIndex === 0) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedRows = newSelectedRows.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.length === list.length);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {

      const newSelectedId = list
        .filter(obj => ApprovalButtons.isEnabled(obj.rfpStatus))
        .map(obj => obj.clearingID);

      setSelectedRows(newSelectedId)
      setSelectAll(newSelectedId.length);
      return;
    }
    else {
      setSelectedRows([])
      setSelectAll(false);
    }
  };

  const isSelected = (name) => selectedRows.indexOf(name) !== -1;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <FilterWrapper title="Filter" >
          <CustomDropdowns
            filter={filter}
            setFilter={setFilter}
            FILTER_={FILTER_}
            customer={authRoles.all.includes(user.role) ? 3 : 5}
            fileno={authRoles.all.includes(user.role) ? 3 : 5}
            employee={authRoles.all.includes(user.role) ? 3 : false}
            clear={authRoles.all.includes(user.role) ? 3 : 2}
            isClearFromParent={isClear}
            setisClear={setisClear}
          />
        </FilterWrapper>
        <MainCard
          content={false}
          title="Daily Expense List"
          secondary={<></>}
        >

          <div className="List-Checkbox-Container">
          </div>
          <CustomTable
            headers={columnConfig}
            hasAction={true}
            enableRowCheckbox={enableRowCheckbox}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            handleSelectAllClick={handleSelectAllClick}
          >
            {getTableRow()}
          </CustomTable>

          <CustomPagination
            list={list}
            count={count}
            rowsPerPage={rowsPerPage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            handleChangePage={handleChangePage}
            page={page}
            isLoading={isLoading} />
        </MainCard>
      </Grid>
    </Grid>
  );
}

let ITEM = null;

function CollapseRow(props) {
  const { row, theme, rowIndex, setOpen, list, isLoading, key } = props;

  const styled = {
    padding : "8px",
    color : theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
    textAlign : "center"
  }

  const [open, setOpenView] = useState(false);

  const handleClose = () => {
    setOpenView(false)
  }
  const handleOpenView = (RowItem) => {
    ITEM = RowItem;
    setOpenView(true)
  }

  return (
    <TableRow sx={{ fontSize: "11px", padding: "10px" }}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0, overflowX: 'auto' }} colSpan={12}>
        <Collapse in={typeof (row.isOpen) === "undefined" ? false : row.isOpen} timeout="auto" unmountOnExit>
          <div style={{ overflowX: 'auto' }}>
            <Box sx={{ margin: 1, padding: "4px", border: "1px solid", borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, borderRadius: "4px" }}>
              <Typography variant="h6" gutterBottom component="div">
                Daily Expense Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                  <TableRow>
                    {/* <TableCell style={{ minWidth: 40 }} align="left">S No</TableCell> */}
                    <TableCell style={{ minWidth: 120 }} align="left">File No</TableCell>
                    <TableCell style={{ minWidth: 150 }} align="left">Customer</TableCell>
                    <TableCell style={{ minWidth: 130 }} align="left">Bill of Lading</TableCell>
                    <TableCell style={{ minWidth: 160 }} align="left">Total Approved Amount</TableCell>
                    <TableCell style={{ minWidth: 160 }} align="left">Total Inprocess Amount</TableCell>
                    <TableCell style={{ minWidth: 60 }} align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map((catRow, index) => (
                    <TableRow hover key={index}>
                      {/* <TableCell style={{ minWidth: 40 }} align="left">
                        <Typography variant="h6" >
                          {index + 1}
                        </Typography>
                      </TableCell> */}
                      <TableCell style={{ minWidth: 40 }} align="left">
                        <Typography variant="h6" >
                          {catRow.fileNo}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 40 }} align="left">
                        <Typography variant="h6" >
                          {catRow.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 40 }} align="left">
                        <Typography variant="h6" >
                          {catRow.billOfLading}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 40 }} align="left">
                        <Typography variant="h6" >
                          {utilsJS.getFormattedAmount(catRow.approvedExpenseAmountTotal)}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 40 }} align="left">
                        <Typography variant="h6" >
                          {utilsJS.getFormattedAmount(catRow.inProcessExpenseAmountTotal)}
                        </Typography>
                      </TableCell>
                      <TableCell style={{ minWidth: 40 }} align="center">
                        
                        <Tooltip title={"Show Details"}>
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => handleOpenView(catRow)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-cog" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                              <path d="M12 18c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                              <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                              <path d="M19.001 15.5v1.5" />
                              <path d="M19.001 21v1.5" />
                              <path d="M22.032 17.25l-1.299 .75" />
                              <path d="M17.27 20l-1.3 .75" />
                              <path d="M15.97 17.25l1.3 .75" />
                              <path d="M20.733 20l1.3 .75" />
                            </svg>
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
               
              </Table>
              <Box sx={{display: "flex", justifyContent: "center"}}>
                {isLoading && list.length === 0 ? (
                        <CircularProgress style={styled} /> // MUI Loader when isLoading is true and list has no data
                    ) : !isLoading && list.length === 0 && (
                  <p style={styled} >No record found</p> // Display "No record found" when isLoading is false and list has no data
                ) }
              </Box>
            </Box>
          </div>
        </Collapse>
      </TableCell>

       {open && <ExpenseDetailsDialog open={open} handleClose={handleClose} item={ITEM}/>}

    </TableRow>
  );
}