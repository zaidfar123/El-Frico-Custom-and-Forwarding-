// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TableCell, TableRow, IconButton, Tooltip, Checkbox, TextField, MenuItem, Collapse, Box, Typography, Table, TableHead, TableBody, Button } from '@mui/material';
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
import ConfirmationDialog from "ui-component/ConfirmationDialog";
import FilterWrapper from "ui-component/FilterWrapper";
import { saveAs } from 'file-saver'; // v2.0.5

var enableRowCheckbox = false;

var FILTER_ = {
    fileNo: "",
    pageNumber: 1,
    pageSize: 20,
    customerID: 0
}

var ITEM = null;

export default function CustomerBillList() {

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
    const [openConfirm, setopenConfirm] = useState(false);
    const [isProcessing, setisProcessing] = useState(false);
    const [isClear, setisClear] = useState(false);

    const getList = () => {

        setisLoading(true);

        AxiosServices.getCutomerBillingList({ ...filter, pageNumber: page, pageSize: rowsPerPage, fileNo: filter.fileNo === "" ? null : filter.fileNo }).then((res) => {
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
        { name: 'Customer', col: 'nameOfImporter', amount: false, select: false, width: 170, textField: false },
        // { name: 'Assessed Amount', col: 'import_AssessedValue', amount: true, select: false, width: 150, textField: false },
        { name: 'Total Bill Amount', col: 'totalAmount', amount: true, select: false, width: 180, textField: false },
        { name: 'Total PayOrder Amount', col: 'totalPaidAmount', amount: true, select: false, width: 180, textField: false },
        { name: 'Remaining Amount', col: 'remainningBillAmount', amount: true, select: false, width: 160, textField: false },
    ];


    const handleClose = () => {
        setOpenView(false)
        ITEM = null;
    }

    const handleOpen = (row) => {

        ITEM = row;
        setOpenView(true)
    };

    const handleCreateBill = (row) => {

        ITEM = row;
        setopenConfirm(true)
    };

    const onHandleCreateBill = () => {

        let model = {
            clearingID: ITEM.clearingID,
            userID: user.id,
            totalAmount: ITEM.currentBillAmount,
            texationCharges: ITEM.texationCharges,
        }

        setisProcessing(true)

        AxiosServices.createCutomerBill(model).then((res) => {

            setisProcessing(false)
            dispatch(
                openSnackbar({
                    open: true,
                    message: "Bill created successfully.",
                    variant: 'alert',
                    alert: {
                        color: "success"
                    },
                    close: true
                }))

            saveAs(res?.data, ITEM.fileNo + "_Bill.pdf")
            onDiscard()

        })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Something went wrong.",
                        variant: 'alert',
                        alert: {
                            color: "error"
                        },
                        close: true
                    }))
                setisProcessing(false)
                onDiscard()
            })
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
                        <TableCell sx={{ pr: 2, width: 160 }} align="center">
                            <Tooltip title={"Generate a Bill"}>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={() => handleCreateBill(row)}
                                >

                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-plus" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                        <path d="M12 11l0 6" />
                                        <path d="M9 14l6 0" />
                                    </svg>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={"Show Details"}>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={() => handleOpen(row)}
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
                    {/* <CollapseRow key={rowIndex} row={row} theme={theme} setOpen={toggleRow} rowIndex={rowIndex} /> */}
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

    const onConfirm = () => {
        onHandleCreateBill()
    };

    const onDiscard = () => {
        setopenConfirm(false)
        getList()
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
                    title="Customer Billing List"
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

                {open && <ViewDetails open={open} handleClose={handleClose} item={ITEM} type="customer" title="Customer Billing Details" />}
                {openConfirm && <ConfirmationDialog
                    open={openConfirm}
                    titie="Are you sure to Generate a Bill?"
                    content="Upon confirmation , you will be provided with a PDF Bill file. Are you sure you want to proceed?"
                    discardTitle="Discard"
                    confirmTitle="Proceed"
                    onDiscard={onDiscard}
                    onConfirm={onConfirm}
                    loading={isProcessing}
                />}

            </Grid>
        </Grid>
    );
}