// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TableCell, TableRow, IconButton, Tooltip, Checkbox, TextField, MenuItem, Collapse, Box, Typography, Table, TableHead, TableBody, Button, Avatar } from '@mui/material';
import AxiosServices from "service";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'react-redux';
import docuemntImage from "assets/images/document.gif"
import { openLoader } from 'store/slices/loadingModal';
import { IconFileDownload } from '@tabler/icons';
import CustomPagination from "ui-component/Pagination";
import CustomTable from "ui-component/CustomTable";
// import ClearanceFilter from "../documents/ClearanceFilter";
import FilterListIcon from '@mui/icons-material/FilterList';
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import Chip from '@mui/material/Chip';
import { useTheme, styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import AutoComplete from 'ui-component/AutoComplete';
import utilsJS from "utilsJS";
import ViewDetails from "./ViewDetails";
import CustomDropdowns from "ui-component/CustomDropdowns";
import FilterWrapper from "ui-component/FilterWrapper";
import DownloadFile from "ui-component/DownloadFile";

var enableRowCheckbox = false;

var FILTER_ = {
    customerID: 0,
    fileNo: "",
    pageNumber: 1,
    pageSize: 20,
}


var ITEM = null;

export default function GeneratedBillList() {

    const dispatch = useDispatch();
    const theme = useTheme();
    const { user } = useAuth();

    const [list, setList] = useState([]);
    const [filter, setFilter] = useState(FILTER_);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const [page, setPage] = useState(1);
    const [count, settotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setisLoading] = useState(false);
    const [isClear, setisClear] = useState(false);

    const getList = () => {

        setisLoading(true);

        let model = { fileNo: filter.fileNo === "" ? null : filter.fileNo }

        AxiosServices.getGeneratedBillingList({ ...model, pageNumber: page, pageSize: rowsPerPage, }).then((res) => {
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
        { name: 'File No', col: 'refNo', amount: false, select: false, width: 140, textField: false },
        { name: 'Customer', col: 'nameOfImporter', amount: false, select: false, width: 150, textField: false },
        { name: 'LC Number', col: 'lC_Number', amount: false, select: false, width: 130, textField: false },
        // { name: 'Bill Date', col: 'billDate', amount: false, select: false, width: 120, textField: false },
        { name: 'Vessel', col: 'vesselName', amount: false, select: false, width: 180, textField: false },
        { name: 'Address', col: 'address', amount: false, select: false, width: 230, textField: false },
    ];

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
                        <TableCell align="center">
                            {typeof (row.isOpen) === "undefined" || !row.isOpen ?

                                <Tooltip title={"Show Details"}>
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => toggleRow(rowIndex)}
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
                                        onClick={() => toggleRow(rowIndex)}
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
                    <CollapseRow key={rowIndex} row={row} theme={theme} setOpen={toggleRow} rowIndex={rowIndex} />
                </React.Fragment>
            );
        });
    };

    const toggleRow = (rowIndex) => {

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
            return row;
        });

        setList(updatedList);
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

    const handleClear = () => {
        setSelectedOptionCustomer("")
        setFilter(FILTER_)
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
                        customer={5}
                        fileno={5}
                        clear={2}
                        isClearFromParent={true}
                        setisClear={setisClear}
                    />
                </FilterWrapper>
                <MainCard
                    content={false}
                    title="Generated Billing List"
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

function CollapseRow(props) {

    const { row, theme, rowIndex, setOpen, key } = props;
    const [open, setOpenView] = useState(false);
 
    const handleClose = () => {
        setOpenView(false)
        ITEM = null;
    }

    const handleOpen = (item) => {
        ITEM = {
            ...item, 
            vesselName : row.vesselName,
            refNo : row.refNo,
            lC_Number : row.lC_Number,
            contents : row.contents,
            address : row.address,
            import_AssessedValue : row.import_AssessedValue,
            container : row.container,
            nameOfImporter : row.nameOfImporter,
            noOfPkgs : row.noOfPkgs,

        };
        setOpenView(true)
    };

    return (
        <TableRow sx={{ fontSize: "11px", padding: "10px" }} >
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, overflowX: 'auto' }} colSpan={12}>
                <Collapse in={typeof (row.isOpen) === "undefined" ? false : row.isOpen} timeout="auto" unmountOnExit>
                    <div style={{ overflowX: 'auto' }}>
                        <Box sx={{ margin: 1, padding: "6px", border: "1px solid", borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, borderRadius: "4px" }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Bill Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                    <TableRow>
                                        <TableCell style={{ minWidth: 120 }} align="left">Bill No</TableCell>
                                        <TableCell style={{ minWidth: 170 }} align="left">BIll Date</TableCell>
                                        <TableCell style={{ minWidth: 180 }} align="left">Bill Amount</TableCell>
                                        <TableCell style={{ minWidth: 180 }} align="left">Bill PDF</TableCell>
                                        <TableCell style={{ minWidth: 100 }} align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.bills.map((rows, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell style={{ minWidth: 40 }} align="left">
                                                <Typography variant="h6" >
                                                    {rows.billNo || "-"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 40 }} align="left">
                                                <Typography variant="h6" >
                                                    {rows.billDate}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 80 }} align="left">
                                                <Typography variant="h6" >
                                                    {utilsJS.getFormattedAmount(rows.billTotalAmount)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 80 }} align="left">
                                            <DownloadFile
                                                    icon={<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-type-pdf" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={rows.vdPath !== null ? "#F40F02" : "#9e9e9e"} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
                                                        <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
                                                        <path d="M17 18h2" />
                                                        <path d="M20 15h-3v6" />
                                                        <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" />
                                                    </svg>}
                                                    model={rows.vdPath}
                                                    DownloadService={AxiosServices.getFileByURL}
                                                    filename={row.refNo + ".pdf"}
                                                    title="Download PDF"
                                                    disabled={rows.vdPath === null}
                                                />
                                            </TableCell>
                                            <TableCell style={{ minWidth: 100 }} align="center">
                                              
                                                <Tooltip title={"Show Details"}>
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => handleOpen(rows)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                            <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                                        </svg>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </div>
                </Collapse>
                {open && <ViewDetails open={open} handleClose={handleClose} item={ITEM} type={"generated"} title="Generated Billing Details" />}
            </TableCell>
        </TableRow>
    );
}