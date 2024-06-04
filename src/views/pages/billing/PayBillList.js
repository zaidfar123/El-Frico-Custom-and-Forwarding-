// material-ui
import React, { useState, useEffect } from "react";
import { Grid, Divider, TableCell, TableRow, IconButton, TableContainer, Paper, Tooltip, Checkbox, TextField, MenuItem, Collapse, Box, Typography, Table, TableHead, TableBody, Button, Avatar } from '@mui/material';
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
import CustomToggleButton from "ui-component/ToggleButton";

var enableRowCheckbox = false;

var FILTER_ = {
    fileNo: "0582",
}

var INITIAL_STATE = {
    billID: 0,
    paidAmount: 0,
    remarks: "",
    userID: 0,
    transferCategoryID: 0,
    base64String: "",
    advanceAmount: 0,
    advanceIDs: ""
}
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));

var ITEM = null;

export default function PayBillList() {

    const dispatch = useDispatch();
    const theme = useTheme();
    const { user } = useAuth();

    const [list, setList] = useState([]);
    const [filter, setFilter] = useState(FILTER_);
    const [state, setState] = useState(INITIAL_STATE);
    const [error, setError] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [FileNoList, setFileNoList] = useState([])
    const [toggle, setToggle] = useState("Pay by Advance")


    const OptionDescription = (option) => option.customerName || "";
    const [selectedOptionCustomer, setSelectedOptionCustomer] = useState("");

    const setOptionsChanges = (options, field) => {

        if (options) {
            setFilter({ ...filter, [field]: options.customerID, })
        } else {
            setFilter({ ...filter, [field]: 0, })
        }
    };

    const handleChange = (event) => {
        let { name, value } = event.target;
        // let fileOBJ = FileNoList.find(x => x.fileNo === value)
        setFilter({ ...filter, [name]: value })
    };

    useEffect(() => {

        if (filter.customerID !== 0) {
            getCustomerFileNo()
        }

    }, [filter.customerID])

    const [page, setPage] = useState(1);
    const [count, settotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setisLoading] = useState(false);
    const [open, setOpenView] = useState(false);
    const [openSetup, setOpenSetup] = useState(false);

    const getList = () => {

        setisLoading(true);

        AxiosServices.getBillDetail(filter).then((res) => {
            let { data, totalCount } = res?.data;
            setisLoading(false);

            if (data) {
                // const count = Math.ceil(totalCount / parseInt(rowsPerPage));
                // settotalCount(count);
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

    const getCustomerFileNo = () => {
        let model = {
            customerID: filter.customerID,
            customTypeID: 0,
            fileNo: "",
            valueSize: 10
        }
        AxiosServices.getCustomerOCRFileNoDropdown(model).then((res) => {
            let { data, message } = res?.data;
            if (data) {
                setFileNoList(data)
            }
            else {
                setFileNoList([])
            }
        })
    }

    const columnConfig = [
        { name: 'File No', col: 'fileNo', amount: false, width: 140 },
        { name: 'Customer', col: 'customerName', amount: false, width: 180, },
        { name: 'Total Advance Amount', col: 'totalAdvanceAmount', amount: true, width: 200, },
        { name: 'Total Remaining Amount', col: 'totalRemainingAmount', amount: true, width: 200, },
    ];


    const handleClose = () => {
        setOpenView(false)
        ITEM = null;
        getList()
    }

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
        setFileNoList([])
    };

    const handleOpenForm = () => {
        setOpenSetup(true)
    };
    const handleCloseSetup = () => {
        setOpenSetup(false)
    };

    const isSelected = (name) => selectedRows.indexOf(name) !== -1;

    const handleChangeNumber = (event) => {
        let { name, value } = event.target;
        const isValidInput = /^[+-]?\d+(\.\d*)?$/.test(value);
        if (isValidInput || value === '') {
          setState({ ...state, [name]: value });
          setError({ ...error, [name]: null });
        }
    }

    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <div className="searchCard" style={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}>
                    <p className="heading">Filter</p>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={5}>
                            <AutoComplete
                                setOptionsChanges={setOptionsChanges}
                                state={filter}
                                errors={{}}
                                selectedOption={selectedOptionCustomer}
                                setSelectedOption={setSelectedOptionCustomer}
                                searchSuggestions={AxiosServices.searchCustomer}
                                getOptionLabel={OptionDescription}
                                field={"customerID"}
                                label={"Customer"}
                                disabled={false}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <StyledTextField
                                value={filter.fileNo}
                                label="File No"
                                onChange={handleChange}
                                size="small"
                                name="fileNo"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                select
                                disabled={filter.customerID === 0}
                            >
                                {FileNoList.length > 0 && FileNoList.map((file, index) => (
                                    <MenuItem key={index} value={file.fileNo}>
                                        {file.fileNo}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </Grid>
                        <Grid item xs={2} className="searchCard-button">

                            <Button variant="outlined" fullWidth
                                onClick={handleClear}
                            >
                                Clear Filter
                            </Button>
                        </Grid>

                    </Grid>
                </div>
                {list.length > 0 && list.map((item) => {

                    return (<MainCard
                        content={true}
                        title={null}
                        secondary={<></>}
                        className="billing-card"
                    >

                        <Grid container spacing={2} className="billing-container">

                            <Grid item sm={4}>
                                <div>
                                    <Typography variant="div">
                                        Bill No :
                                    </Typography>
                                    <Typography variant="h6">
                                        {item.billNo}
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item sm={4}>
                                <div>
                                    <Typography variant="div">
                                        File No :
                                    </Typography>
                                    <Typography variant="h6">
                                        {item.fileNo}
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item sm={4}>
                                <div>
                                    <Typography variant="div">
                                        Bill Date :
                                    </Typography>
                                    <Typography variant="h6">
                                        {item.billDate}
                                    </Typography>
                                </div>
                            </Grid>

                            <Grid item sm={4}>
                                <div>
                                    <Typography variant="div">
                                        Customer :
                                    </Typography>
                                    <Typography variant="h6">
                                        {item.customerName}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item sm={4}>

                                <div>
                                    <Typography variant="div">
                                        Total Amount to be Paid :
                                    </Typography>
                                    <Typography variant="h6">
                                        {utilsJS.getFormattedAmount(item.totalAmount)}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item sm={4}>
                                <div>
                                    <Typography variant="div">
                                        Total Paid Amount :
                                    </Typography>
                                    <Typography variant="h6">
                                        {utilsJS.getFormattedAmount(item.paidTotalAmount)}
                                    </Typography>
                                </div>
                            </Grid>


                            <Grid item sm={4}>
                                <div>
                                    <Typography variant="div">
                                        Remaining Amount to paid :
                                    </Typography>
                                    <Typography variant="h6">
                                        {utilsJS.getFormattedAmount(item.remainingTotalAmount)}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item sm={4}>
                                <div>
                                    <Typography variant="div">
                                        Total Advance Amount :
                                    </Typography>
                                    <Typography variant="h6">
                                        {utilsJS.getFormattedAmount(item.totalAdvanceAmount)}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item sm={4}>

                                <div>
                                    <Typography variant="div">
                                        Total Advance Remaining Amount :
                                    </Typography>
                                    <Typography variant="h6">
                                        {utilsJS.getFormattedAmount(item.totalAdvanceRemainingAmount)}
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>

                        <div style={{ margin: "20px 0" }}>
                            <Divider style={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }} variant="fullWidth" />
                        </div>


                        <Grid container spacing={2}>

                            <Grid item sm={12}><Typography variant="h6"> Payment History</Typography></Grid>

                            <Grid item sm={12}>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} size="small">
                                        <TableHead style={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                            <TableRow>
                                                <TableCell align="left">Category</TableCell>
                                                <TableCell align="left">Remarks</TableCell>
                                                <TableCell align="left">Attachment</TableCell>
                                                <TableCell align="left">Paid on</TableCell>
                                                <TableCell align="right">Paid Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {item.paymentListModels.length > 0 && item.paymentListModels.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        <Typography variant="h6">{row.transferCategoryName}</Typography>
                                                    </TableCell>
                                                    <TableCell align="left"><Typography variant="h6">{row.remarks}</Typography></TableCell>
                                                    <TableCell align="left"><Avatar src={row.vdPath} variant="rounded"></Avatar></TableCell>
                                                    <TableCell align="left"><Typography variant="h6">{row.lastPaymentDate}</Typography></TableCell>
                                                    <TableCell align="right"><Typography variant="h6">{utilsJS.getFormattedAmount(row.paidAmount)}</Typography></TableCell>
                                                    {/* <TableCell align="right">{row.protein}</TableCell> */}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>

                        <div style={{ margin: "20px 0" }}>
                            <Divider style={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }} variant="fullWidth" />
                        </div>


                        <Grid container spacing={2}>

                            <Grid item sm={12}><Typography variant="h6">Pay your Bill</Typography></Grid>

                            <Grid item sm={4}>
                                <CustomToggleButton buttons={["Pay by Advance", "Pay Directly"]} setSelected={setToggle} selected={toggle}  />
                            </Grid>

                            <Grid item sm={12}>
                            <Grid item xs={6}>
                                  <TextField fullWidth error={!!error.paidAmount} helperText={error.paidAmount} InputLabelProps={{ shrink: true }} size="small" onChange={handleChangeNumber} value={state.paidAmount} name="paidAmount" label="Invoice Total Amount" />
                              </Grid>
                            </Grid>
                        </Grid>
                    </MainCard>)
                })
                }

                {open && <ViewDetails open={open} handleClose={handleClose} item={ITEM} />}

            </Grid>
            {openSetup && <PayOrderDialog open={openSetup} handleClose={handleCloseSetup} />}
        </Grid>
    );
}
