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
import PayOrderDialog from "./PayOrderDialog";
import ViewImage from "../documents/ViewImage";
import CustomDropdowns from "ui-component/CustomDropdowns";
import FilterWrapper from "ui-component/FilterWrapper";

var enableRowCheckbox = false;

var FILTER_ = {
    customerID: 0,
    ocrid: 0,
    pageNumber: 1,
    pageSize: 20,
}

var ITEM = null;

export default function AdvancePayOrderList() {

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
    const [open, setOpenView] = useState(false);
    const [openSetup, setOpenSetup] = useState(false);
    const [isClear, setisClear] = useState(false);

    const getList = () => {

        setisLoading(true);

        let model = {
            id : filter.ocrid,
            customerID : filter.customerID
        }
        AxiosServices.getAdvancePayorderList({ ...model, pageNumber: page, pageSize: rowsPerPage }).then((res) => {
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
        { name: 'File No', col: 'fileNo', amount: false, width: 170 },
        { name: 'Customer', col: 'customerName', amount: false, width: 250, },
        { name: 'Total Pay Order Amount', col: 'totalAdvanceAmount', amount: true, width: 200, },
        // { name: 'Total Remaining Amount', col: 'totalRemainingAmount', amount: true, width: 200, },
    ];


    const handleClose = () => {
        setOpenView(false)
        ITEM = null;
        getList()
    }

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
                            <TableCell key={colIndex} align="left" style={{ maxWidth: column.width }}>
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


    const handleOpenForm = () => {
        setOpenSetup(true)
    };
    const handleCloseSetup = () => {
        setOpenSetup(false)
        getList()
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
    const isSelected = (name) => selectedRows.indexOf(name) !== -1;

    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <Button variant="contained" onClick={() => handleOpenForm()}>Add Pay Order</Button>
            </Grid>

            <Grid item xs={12}>
                <FilterWrapper title="Filter" >
                    <CustomDropdowns
                        filter={filter}
                        setFilter={setFilter}
                        FILTER_={FILTER_}
                        customer={5}
                        ocridAD={5}
                        clear={2}
                        isClearFromParent={true}
                        setisClear={setisClear}
                    />
                </FilterWrapper>
                <MainCard
                    content={false}
                    title="Pay Order List"
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

                {open && <ViewDetails open={open} handleClose={handleClose} item={ITEM} />}

            </Grid>
            {openSetup && <PayOrderDialog open={openSetup} handleClose={handleCloseSetup} />}
        </Grid>
    );
}

var IMAGE = null;

function CollapseRow(props) {

    const { row, theme, rowIndex, setOpen, key } = props;
    const [open, setOpenImage] = useState(false);

    const handleOpen = (img) => {
        IMAGE = img;
        setOpenImage(true)
    }
    return (
        <TableRow sx={{ fontSize: "11px", padding: "10px" }} onClick={() => setOpen(rowIndex)}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, overflowX: 'auto' }} colSpan={12}>
                <Collapse in={typeof (row.isOpen) === "undefined" ? false : row.isOpen} timeout="auto" unmountOnExit>
                    <div style={{ overflowX: 'auto' }}>
                        <Box sx={{ margin: 1, padding: "6px", border: "1px solid", borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, borderRadius: "4px" }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Pay Order Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                    <TableRow>
                                        <TableCell style={{ minWidth: 120 }} align="left">Pay Order No</TableCell>
                                        <TableCell style={{ minWidth: 170 }} align="left">Transfer Category</TableCell>
                                        <TableCell style={{ minWidth: 180 }} align="left">Pay Order Amount</TableCell>
                                        {/* <TableCell style={{ minWidth: 80 }} align="left">Remaining Amount</TableCell> */}
                                        <TableCell style={{ minWidth: 60 }} align="left">Date</TableCell>
                                        <TableCell style={{ minWidth: 180 }} align="left">Remarks</TableCell>
                                        <TableCell style={{ minWidth: 100 }} align="left">Attachment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.advanceDetails.map((row, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell style={{ minWidth: 40 }} align="left">
                                                <Typography variant="h6" >
                                                    {row.payorderNo || "-"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 40 }} align="left">
                                                <Typography variant="h6" >
                                                    {row.transferCategoryName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 100 }} align="left">
                                                {/* <Typography variant="h6" >
                                                    {utilsJS.getFormattedAmount(row.advanceAmount)}
                                                </Typography> */}
                                                <div style={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                                    <Typography variant="h6" >
                                                        {utilsJS.getFormattedAmount(row.advanceAmount)}
                                                    </Typography>
                                                    {/* <Typography variant="caption">
                                                        {utilsJS.getFormattedAmount(row.remainingAmount)}
                                                    </Typography> */}
                                                </div>
                                            </TableCell>
                                            {/* <TableCell style={{ minWidth: 130 }} align="left">
                                                <Typography variant="h6" >
                                                    {utilsJS.getFormattedAmount(row.remainingAmount)}
                                                </Typography>
                                            </TableCell> */}
                                            <TableCell style={{ minWidth: 100 }} align="left">
                                                <Typography variant="h6" >
                                                    {row.payorderDate || "-"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 180 }} align="left">
                                                <Typography variant="h6" >
                                                    {row.remarks}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 180 }} align="left">
                                                <Avatar variant="rounded" style={{ cursor: "pointer" }} onClick={() => handleOpen(row.vdPath)} src={row.vdPath}></Avatar>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </div>
                </Collapse>
                {open && <ViewImage open={open} handleClose={() => setOpenImage(false)} image={IMAGE} title="Pay Order Attachment" />}
            </TableCell>
        </TableRow>
    );
}