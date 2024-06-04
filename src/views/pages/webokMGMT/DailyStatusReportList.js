// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TableCell, TableRow, IconButton, Tooltip, Checkbox, TextField, MenuItem, Collapse, Box, Typography, Table, TableHead, TableBody } from '@mui/material';
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
import ClearanceFilter from "../documents/ClearanceFilter";
import FilterListIcon from '@mui/icons-material/FilterList';
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import Chip from '@mui/material/Chip';
import { useTheme, styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';

var item = null;
var enableRowCheckbox = false;

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
    consigneeStatusID: 0,
    rfpStatusID: 0,
}
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));
export default function DailyStatusReportList() {

    const [list, setList] = useState([]);
    const [OptionsList, setOptionsList] = useState([]);
    const [open, setOpen] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    const [isProcessing, setisProcessing] = useState(false);
    const [filter, setFilter] = useState(FILTER_);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [activeSelectIndex, setactiveSelectIndex] = useState(-1);
    const [statusValue, setStatusValue] = useState(0);
    const dispatch = useDispatch();
    const theme = useTheme();

    const { user } = useAuth();

    const [consigneeStatusList, setConsigneeStatusList] = useState([]);


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

    const handleOpenDetail = () => {
        setOpen(!open);
    }
    const handleClose = () => {
        setOpen(false);
        item = null;
    }
    const getList = () => {

        setisLoading(true);
        setActiveIndex(-1);

        AxiosServices.getWebokList({ ...filter, pageNumber: page, pageSize: rowsPerPage }).then((res) => {
            let { data, totalCount } = res?.data;

            setisLoading(false);

            let updatedState = [...list];

            if (list.length > 0 && data) {

                data.forEach(newItem => {
                    // Check if the item already exists in the state
                    const existingItemIndex = updatedState.findIndex(item => item.clearingID === newItem.clearingID);

                    if (existingItemIndex !== -1) {
                        // If the item exists, update its values with the new data
                        updatedState[existingItemIndex] = { ...updatedState[existingItemIndex], ...newItem };
                    } else {
                        // If the item doesn't exist, add it to the state
                        updatedState.push(newItem);
                    }
                });
                setList(updatedState);
                setactiveSelectIndex(-1)
            }
            else {
                setList(data);
            }

            if (data) {
                const count = Math.ceil(totalCount / parseInt(rowsPerPage));
                settotalCount(count);
                // setList(data);
            }
            else {
                setList([]);
                setactiveSelectIndex(-1)
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

    const handleDropdownChange = (event,index) => {
        let { value } = event.target;
        setStatusValue(value)
        setactiveSelectIndex(index)
    }

    const handleStatus = (Id,remarks) => {
        let model = {
            clearingID: Id,
            consigneeStatusID: statusValue,
            webocRemarks: remarks,
            userID: user?.id
        }
        updateConsigneeStatus(model, "dropdown")
    }

    const handleRemarks = (rowIndex) => {
        let row = list[rowIndex];

        let model = {
            clearingID: row.clearingID,
            consigneeStatusID: row.consigneeStatusID,
            webocRemarks: row.webocRemarks,
            userID: user?.id
        }
        updateConsigneeStatus(model, "field")
    }

    const updateConsigneeStatus = (model, action) => {

        AxiosServices.updateConsigneeStatus([model]).then((res) => {
            let { data, message } = res?.data;

            dispatch(
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: message === "Consignee Status changed successfully." ? "success" : "error"
                    },
                    close: true
                }))

            if (action === "field") {
                getList()
                setActiveIndex(-1)
            } else {
                AxiosServices.insertHistoryConsignee([model]).then((res) => {
                    getList()
                    setActiveIndex(-1)
                })
            }
        })
    }

    const getConsigneeStatus = () => {

        AxiosServices.getConsigneeStatus().then((res) => {
            let { data, message } = res?.data;
            if (data) {
                setConsigneeStatusList(data)
            }
            else {
                setConsigneeStatusList([])
            }
        })
    }

    useEffect(() => {
        getConsigneeStatus()
    }, []);

    const columnConfig = [
        { name: 'File No', col: 'fileNo', select: false, width: 120, textField: false },
        { name: 'Consignee', col: 'consignee', select: false, width: 200, textField: false },
        { name: 'Bill of Lading', col: 'billOfLading', select: false, width: 120, textField: false },
        { name: 'Status', col: 'consigneeStatus', select: true, width: 230, textField: false },
        { name: 'Remarks', col: 'webocRemarks', select: false, width: 200, textField: true },
    ];

    const handleRemarksChange = (event, rowIndex) => {
        const { value, name } = event.target;

        const updatedList = list.map((row, index) => {
            if (index === rowIndex) {
                return { ...row, [name]: value };
            }
            return row;
        });

        setActiveIndex(rowIndex)
        setList(updatedList);
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
                            column.select ?
                                <TableCell key={colIndex} align="left" style={{ maxWidth: column.width }}>
                                    <div style={{ display: 'flex', gap: "6px" }}>
                                        <StyledTextField
                                            value={activeSelectIndex === rowIndex ? statusValue : row["consigneeStatusID"]}
                                            // label="Shipment Type"
                                            onChange={(event) => handleDropdownChange(event,rowIndex)}
                                            // onChange={(event) => handleDropdownChange(event, row["clearingID"], row["webocRemarks"])}
                                            size="small"
                                            name="consigneeStatusID"
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            select
                                        >
                                            {consigneeStatusList.length > 0 && consigneeStatusList.map((item, index) => (
                                                <MenuItem key={index} value={item.consigneeStatusID}>
                                                    {item.consigneeStatus}
                                                </MenuItem>
                                            ))}
                                        </StyledTextField>
                                        {activeSelectIndex === rowIndex && <Tooltip title="Update Status">
                                            <IconButton color="success" aria-label="approve" onClick={() => handleStatus(row["clearingID"], row["webocRemarks"])}>
                                                <CheckIcon />
                                            </IconButton>
                                        </Tooltip>}
                                    </div>
                                </TableCell> :
                                column.textField ?
                                    <TableCell key={colIndex} align="left" style={{ maxWidth: column.width }}>
                                        <div style={{ display: 'flex', gap: "6px" }}>
                                            <TextField fullWidth InputLabelProps={{ shrink: true }} size="small" onChange={(event) => handleRemarksChange(event, rowIndex)} value={row[column.col]} name={column.col} />
                                            {activeIndex === rowIndex && <Tooltip title="Update remarks">
                                                <IconButton color="success" aria-label="approve" onClick={() => handleRemarks(rowIndex)}>
                                                    <CheckIcon />
                                                </IconButton>
                                            </Tooltip>}
                                        </div>

                                    </TableCell>
                                    :
                                    <TableCell key={colIndex} align="left" style={{ maxWidth: column.width }}>
                                        <Typography variant="h6" >
                                            {row[column.col]}
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

    const getApprovalAction = () => {
        let RowsCount = selectedRows.length;

        return (
            <div className="approval-action-container">
                <p>{RowsCount} Selected Row(s)</p>
                <>
                    <ApprovalButtons.ApproveIcon Id={selectedRows} rejected={false} approved={true} onApproval={onApproval} disabled={false} />
                    <ApprovalButtons.RejectIcon Id={selectedRows} rejected={true} approved={false} onApproval={onApproval} disabled={false} />
                </>
            </div>
        )
    };

    const isSelected = (name) => selectedRows.indexOf(name) !== -1;

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MainCard
                    content={false}
                    title="Consignment Daily Status Report"
                    secondary={
                        <>
                            {selectedRows.length > 0 && getApprovalAction()}
                            <Tooltip title="Filter">
                                <IconButton aria-label="delete" onClick={() => setOpenFilter(true)}>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Download Clearing Summary">
                                <IconButton aria-label="delete" onClick={() => downLoadAllDocument()}>
                                    <IconFileDownload style={{color :  theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}} />
                                </IconButton>
                            </Tooltip> */}
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
                        isLoading={isLoading}
                    />

                    <ClearanceFilter
                        open={openFilter}
                        filter={filter}
                        handleClose={handleCloseFilter}
                        setFilter={setFilter}
                        generateList={true}
                        FILTER_={FILTER_}
                        title={"Consignment Daily Status Report Filter"}
                        OptionsList={OptionsList}
                        setOptionsList={setOptionsList}
                        rfp={false}
                        consignee={true}
                    />

                </MainCard>
            </Grid>
            {/* {open && <ViewDetails open={open} handleClose={handleClose} item={item} />} */}
        </Grid>
    );
}


function CollapseRow(props) {
    const { row, theme, rowIndex, setOpen, key } = props;


    return (
        <>
            <TableRow sx={{ fontSize: "11px", padding: "10px" }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, overflowX: 'auto' }} colSpan={12}>
                    <Collapse in={typeof (row.isOpen) === "undefined" ? false : row.isOpen} timeout="auto" unmountOnExit>
                        <div style={{ overflowX: 'auto' }}>
                            <Box sx={{ margin: 1, padding: "6px", border: "1px solid", borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, borderRadius: "4px" }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Shipment Details
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                        <TableRow>
                                            {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                            {/* <TableCell style={{ minWidth: 130 }} align="left">Shipment Type</TableCell> */}
                                            <TableCell style={{ minWidth: 150 }} align="left">Shipment Details</TableCell>
                                            {/* <TableCell style={{ minWidth: 190 }} align="left">Shipment Type Details</TableCell> */}
                                            {/* <TableCell style={{ minWidth: 130 }} align="left">Cargo Type</TableCell> */}
                                            <TableCell style={{ minWidth: 130 }} align="left">Cargo Details</TableCell>
                                            {/* <TableCell style={{ minWidth: 150 }} align="left">Cargo Type Details</TableCell> */}
                                            <TableCell style={{ minWidth: 80 }} align="left">Count</TableCell>
                                            <TableCell style={{ minWidth: 130 }} align="left">Item Category</TableCell>
                                            <TableCell style={{ minWidth: 100 }} align="left">Terminal</TableCell>
                                            <TableCell style={{ minWidth: 100 }} align="left">Collectorate</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.shippingResponses.map((catRow, index) => (
                                            <TableRow hover key={index}>
                                                {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                {/* <TableCell style={{ minWidth: 90 }} align="left">{catRow.shipmentTypeName}</TableCell> */}
                                                <TableCell style={{ minWidth: 90 }} align="left">
                                                    <div style={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                                        <Typography variant="h6" >
                                                            {catRow.shipmentTypeName}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {catRow.shipmentTypeDetailName}
                                                        </Typography>
                                                    </div>
                                                </TableCell>

                                                <TableCell style={{ minWidth: 90 }} align="left">
                                                    <div style={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                                        <Typography variant="h6" >
                                                            {catRow.cargoTypeName}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {catRow.cargoTypeDetailName}
                                                        </Typography>
                                                    </div>
                                                </TableCell>
                                                {/* <TableCell style={{ minWidth: 80 }} align="left">{catRow.shipmentTypeDetailName}</TableCell> */}
                                                {/* <TableCell style={{ minWidth: 80 }} align="left">{catRow.cargoTypeName}</TableCell>
                                        <TableCell style={{ minWidth: 100 }} align="left">{catRow.cargoTypeDetailName}</TableCell> */}
                                                <TableCell style={{ minWidth: 40 }} align="left">
                                                    <Typography variant="h6" >
                                                        {catRow.count}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ minWidth: 100 }} align="left">
                                                    <Typography variant="h6" >
                                                        {catRow.itemCategoryName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ minWidth: 130 }} align="left">
                                                    <Typography variant="h6" >
                                                        {catRow.terminalName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ minWidth: 180 }} align="left">
                                                    <Typography variant="h6" >
                                                        {catRow.collectorateName}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
            <TableRow sx={{ fontSize: "11px", padding: "10px" }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0, overflowX: 'auto' }} colSpan={12}>
                    <Collapse in={typeof (row.isOpen) === "undefined" ? false : row.isOpen} timeout="auto" unmountOnExit>
                        <div style={{ overflowX: 'auto' }}>
                            <Box sx={{ margin: 1, padding: "6px", border: "1px solid", borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, borderRadius: "4px" }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Webok Status History
                                </Typography>
                                <Table size="small" aria-label="purchases">
                                    <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                        <TableRow>
                                            <TableCell style={{ minWidth: 150 }} align="left">User Name</TableCell>
                                            <TableCell style={{ minWidth: 130 }} align="left">Status</TableCell>
                                            <TableCell style={{ minWidth: 80 }} align="left">Date</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.mapStatuses.map((history, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell style={{ minWidth: 40 }} align="left">
                                                    <Typography variant="h6" >
                                                        {history.userDetailName || ""}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ minWidth: 100 }} align="left">
                                                    <Typography variant="h6" >
                                                        {history.mapConsigneeStatus}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell style={{ minWidth: 130 }} align="left">
                                                    <Typography variant="h6" >
                                                        {history.mapWebokStatusDate}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </div>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}