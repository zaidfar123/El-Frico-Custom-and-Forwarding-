// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TableCell, TableRow, IconButton, Tooltip, Checkbox, Typography } from '@mui/material';
import AxiosServices from "service";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import ViewDetails from "./ViewDetails";
import { useDispatch } from 'react-redux';
import docuemntImage from "assets/images/document.gif"
import { openLoader } from 'store/slices/loadingModal';
import { IconFileDownload } from '@tabler/icons';
import CustomPagination from "ui-component/Pagination";
import CustomTable from "ui-component/CustomTable";
import utilsJS from "utilsJS";
import ClearanceFilter from "./ClearanceFilter";
import FilterListIcon from '@mui/icons-material/FilterList';
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import Chip from '@mui/material/Chip';
import { useTheme, styled } from '@mui/material/styles';
import DownloadFile from "ui-component/DownloadFile";

var item = null;
var enableRowCheckbox = true;

var FILTER_ = {
    pagenumber: 0,
    pageSize: 0,
    ocrid: 0,
    customTypeID: 0,
    customerID: 0,
    clearingID: 0,
    fileNo: "",
    itemCategoryID: 0,
    billOflading: "",
    vessel: "",
    terminalID: 0,
    shipmentTypeDetailID: 0,
    cargoTypeID: 0,
    cargoTypeDetailID: 0,
    collectorateID: 0,
    rfpStatusID: 0,
}

export default function ClearingList() {

    const [list, setList] = useState([]);
    const [OptionsList, setOptionsList] = useState([]);
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [isProcessing, setisProcessing] = useState(false);
    const [filter, setFilter] = useState(FILTER_);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const dispatch = useDispatch();
    const theme = useTheme();

    const { user } = useAuth();

    const [page, setPage] = useState(1);
    const [count, settotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setisLoading] = useState(false);

    const handleLoaderDispatch = (open, description, hasImage) => {
        dispatch(openLoader({
            open: open,
            description: description,
            hasImage: hasImage
        }))
    }

    const handleCloseFilter = () => {
        setOpenFilter(false)
    }
    const handleResetFilter = () => {
        setSelectedOptionCustomer("")
        setFilter(FILTER_)
    }

    const handleOpenDetail = (row) => {
        item = row;
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        item = null;
    }
    const getList = () => {

        setisLoading(true);

        AxiosServices.getClearingList({ ...filter, pageNumber: page, pageSize: rowsPerPage }).then((res) => {
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
    const downLoadAllDocument = () => {

        handleLoaderDispatch(true, "Please wait while we are downloading your file.", docuemntImage)

        AxiosServices.downloadAllDocument().then((res) => {
            let { data } = res;
            utilsJS.downloadExcel(data, 'Clearing_Record_Summary.xlsx');
            handleLoaderDispatch(false, "", null)

        })
    }

    const downLoadDocument = (row) => {

        handleLoaderDispatch(true, "Please wait while we are downloading your file.", docuemntImage)
        let model = {
            id: row.clearingID
        }
        AxiosServices.downloadDocument(model).then((res) => {
            let { data } = res;
            utilsJS.downloadExcel(data, row.fileNo + '_Clearing_Record.xlsx');
            handleLoaderDispatch(false, "", null)
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
        { name: 'File No', col: 'fileNo', pdf: false, rfp: false, hasChip: false },
        { name: 'Consignee', col: 'consignee', pdf: false, rfp: false, hasChip: false, width: 150 },
        { name: 'Bill of Lading', col: 'billOfLading', pdf: false, rfp: false, hasChip: false },
        { name: 'Date', col: 'creationDate', pdf: false, rfp: false, hasChip: false, width: 150 },
        { name: 'Status', col: 'rfpStatus', pdf: false, rfp: false, hasChip: true },
        { name: 'GD', col: 'GD', pdf: true, rfp: false, hasChip: false },
        { name: 'RFP', col: 'RFP', pdf: false, rfp: true, hasChip: false, width: 220, align: "center" },
        // Add more columns as needed...
    ];

    const onApproval = async (props) => {


        setisProcessing(true);

        let model = [];

        props.Id.map((id) => {
            model.push({
                clearingID: id,
                userID: user.id,
                approved: props.approved,
                rejected: props.rejected,
                reason: ""
            })
        })

        try {
            const response = await ApprovalAPI(model);
            let { message } = response;
            setisProcessing(false);

            dispatch(
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: message === "RFP Approved successfully." ? "success" : "error"
                    },
                    close: true
                }))

            getList()
            setOpen(false);
            setSelectedRows([])
            setSelectAll(false);

        } catch (error) {
            setisProcessing(false);
            console.error('Error approving:', error);
        }

    }

    const ApprovalAPI = async (Model) => {
        try {
            const res = await AxiosServices.approveClearing(Model);
            return res?.data; // Return the data
        } catch (error) {
            throw new Error('ApprovalAPI Error:', error);
        }
    };


    const getChipColor = (value) => {
        if (value === "RFP Initiated") {
            return "#ff9800"
        }
        else if (value === "RFP Approved") {
            return "#4F8A10"
        }
        else {
            return "#D8000C"
        }
    }

    const getTableRow = () => {
        return list.map((row, rowIndex) => {
            const isItemSelected = isSelected(row.clearingID);

            return (
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
                        column.hasChip ?
                            <TableCell key={colIndex} align="left">
                                <Chip size="small" label={row[column.col]} style={{ color: getChipColor(row[column.col]), borderColor: getChipColor(row[column.col]), fontSize: "10px" }} variant="outlined" />
                            </TableCell> :
                            column.pdf ?
                                <TableCell key={colIndex} align="left">
                                    <DownloadFile
                                        icon={<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-type-pdf" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={!ApprovalButtons.isEnabled(row.rfpStatus) ? "#F40F02" : "#9e9e9e"} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                            <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
                                            <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
                                            <path d="M17 18h2" />
                                            <path d="M20 15h-3v6" />
                                            <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" />
                                        </svg>}
                                        model={row.clearingID}
                                        DownloadService={AxiosServices.downloadGDPDF}
                                        filename={row.fileNo + "_GD.pdf"}
                                        title="Download Goods Declaration PDF"
                                        disabled={ApprovalButtons.isEnabled(row.rfpStatus)}
                                    />
                                </TableCell> :
                                column.rfp ?
                                    <TableCell key={colIndex} align="center">
                                        <Tooltip title={ApprovalButtons.isAuthentic(user.role) ? "View Details and Approve" : "View Details"}>
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => handleOpenDetail(row)}
                                            >
                                                {
                                                    ApprovalButtons.isAuthentic(user.role) ? <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-edit" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                        <path d="M11.192 17.966c-3.242 -.28 -5.972 -2.269 -8.192 -5.966c2.4 -4 5.4 -6 9 -6c3.326 0 6.14 1.707 8.442 5.122" />
                                                        <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                                                    </svg> :
                                                        <RemoveRedEyeIcon fontSize="small" color="primary" />
                                                }
                                            </IconButton>
                                        </Tooltip>
                                        <DownloadFile
                                            icon={<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-type-pdf" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#F40F02" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
                                                <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
                                                <path d="M17 18h2" />
                                                <path d="M20 15h-3v6" />
                                                <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 DownloadFile-2 -2h-1z" />
                                            </svg>}
                                            model={row.clearingID}
                                            DownloadService={AxiosServices.downloadClearingPDF}
                                            filename={row.fileNo + ".pdf"}
                                            title="Download PDF"
                                        />
                                        <Tooltip title="Download Excel">
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => downLoadDocument(row)}
                                            >
                                                <DownloadForOfflineIcon fontSize="small" color="secondary" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    :
                                    <TableCell key={colIndex} align="left">
                                        <Typography variant="h6">
                                            {row[column.col]}
                                        </Typography>
                                    </TableCell>
                    ))}
                    <TableCell sx={{ minWidth: 100 }} align="center">

                        {ApprovalButtons.isAuthentic(user.role) &&
                            <>
                                <ApprovalButtons.ApproveIcon Id={[row.clearingID]} rejected={false} approved={true} onApproval={onApproval} disabled={!ApprovalButtons.isEnabled(row.rfpStatus)} />
                                <ApprovalButtons.RejectIcon Id={[row.clearingID]} rejected={true} approved={false} onApproval={onApproval} disabled={!ApprovalButtons.isEnabled(row.rfpStatus)} />
                            </>
                        }
                    </TableCell>
                </TableRow>
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

    const getApprovalAction = () => {
        let RowsCount = selectedRows.length;

        return (
            <div className="approval-action-container">
                {ApprovalButtons.isAuthentic(user.role) &&
                    <>
                        <p>{RowsCount} Selected Row(s)</p>
                        <ApprovalButtons.ApproveIcon Id={selectedRows} rejected={false} approved={true} onApproval={onApproval} disabled={false} />
                        <ApprovalButtons.RejectIcon Id={selectedRows} rejected={true} approved={false} onApproval={onApproval} disabled={false} />
                    </>}
            </div>
        )
    };

    const isSelected = (name) => selectedRows.indexOf(name) !== -1;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MainCard
                    content={false}
                    title="Clearing List"
                    secondary={
                        <>
                            {selectedRows.length > 0 && getApprovalAction()}
                            <Tooltip title="Filter">
                                <IconButton aria-label="delete" onClick={() => setOpenFilter(true)}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                            <DownloadFile
                                icon={<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-file-type-pdf" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#F40F02" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                    <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
                                    <path d="M5 18h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6" />
                                    <path d="M17 18h2" />
                                    <path d="M20 15h-3v6" />
                                    <path d="M11 15v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z" />
                                </svg>}
                                model={null}
                                DownloadService={AxiosServices.downloadAllClearingPDF}
                                filename={"Clearing Summary.pdf"}
                                title="Download Clearing Summary PDF"
                            />
                            <Tooltip title="Download Clearing Summary">
                                <IconButton aria-label="delete" onClick={() => downLoadAllDocument()}>
                                    <IconFileDownload style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }} />
                                </IconButton>
                            </Tooltip>
                        </>
                    }
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

                    <ClearanceFilter
                        open={openFilter}
                        filter={filter}
                        handleClose={handleCloseFilter}
                        setFilter={setFilter}
                        generateList={true}
                        FILTER_={FILTER_}
                        title={"Clearing List Filter"}
                        OptionsList={OptionsList}
                        setOptionsList={setOptionsList}
                        rfp={true}
                        consignee={false}
                    />

                </MainCard>
            </Grid>
            {open && <ViewDetails isLoading={isProcessing} open={open} handleClose={handleClose} item={item} onApproval={onApproval} FILTER_={FILTER_} />}
        </Grid>
    );
}
