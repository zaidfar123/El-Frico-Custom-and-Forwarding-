import React, { useState, useEffect } from 'react';
import { Grid, Avatar, TextField, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, IconButton, Tooltip, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SwitchCard from 'ui-component/SwitchCard';
import AutoComplete from 'ui-component/AutoComplete';
import AxiosServices from 'service';
import NumberFormat from 'react-number-format';
import { clearingAgency, agencyConfiguration } from "validation"
import AxiosService from "service"
import useAuth from 'hooks/useAuth';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import utilsJS from "utilsJS";

// import "./style.css";

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
    fontWeight: 500,
    fontSize: "13px"
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
    fontSize: "11px"
}));
const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    // borderRadius: "6px"
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const initialAgency = {
    agencyID: 0,
    ppid: 0,
    amount: "",
    narration: "",
    narration: "",
    ntn: false
}
const initialState = {
    clearingID: 0,
    customTypeID: 1,
    wharf: null,
    shedNo: null,
    userID: 0,
    customerID: 0,
    fileNo: "",
    dailyExpenseCategoryModels: null
}

export default function ClearingAgencyForm({ clearingID = null, isDisabled = false, isOpenFromModal = false, getClearingAgency, ntn, customer }) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [error, setError] = useState({})
    const [state, setState] = useState(initialState);
    const [agencyList, setAgencyList] = useState([])
    const [paymentPurposeList, setPaymentPurposeList] = useState([])
    const [agencyTable, setAgencyTable] = useState([])
    const [agency, setAgencyState] = useState(initialAgency)
    const [errorAgency, setErrorAgency] = useState({})
    const [clearingAgencyList, setClearingAgencyList] = useState([])

    const onhandleAddAgency = () => {
        const newData = [
            ...clearingAgencyList,
            { ...agency, amount: parseFloat(agency.amount) },
        ];
        setClearingAgencyList(newData)
        setAgencyState(initialAgency)
        setError({ ...error, agenciesClearingRequestModels: "" })
    }

    const handleChange = (event) => {
        setAgencyState({...agency, ntn : event.target.checked});
    };

    const handleAgencyChange = (event) => {

        let { value, name } = event?.target;
        setAgencyState({ ...agency, [name]: value });
        setErrorAgency((prevErrors) => ({
            ...prevErrors,
            [name]: null,
        }));
    }

    const AddtoAgency = () => {
        clearingAgency
            .validate(agency, { abortEarly: false })
            .then(() => {
                onhandleAddAgency()
            })
            .catch((err) => {
                // if state is invalid, update Errors state with error messages
                const newErrors = {};
                if (err && err.inner) {
                    err.inner.forEach((error) => {
                        newErrors[error.path] = error.message;
                    });
                }
                setErrorAgency(newErrors);
            });
    };

    const handleSubmit = () => {

        let model = {
            customerID: state.customerID,
            fileNo: state.fileNo,
            agenciesClearingRequestModels: clearingAgencyList.length > 0 ? clearingAgencyList : null,
        }
        agencyConfiguration
            .validate(model, { abortEarly: false })
            .then(() => {
                onhandleSubmit()
            })
            .catch((err) => {
                // if state is invalid, update Errors state with error messages
                const newErrors = {};
                if (err && err.inner) {
                    err.inner.forEach((error) => {
                        newErrors[error.path] = error.message;
                    });
                }
                setError(newErrors);
            });
    };

    const editRow = (row, index) => {
        setAgencyState(row)
        deleteRow(index)
    };

    const getAgencyValue = (row) => {
        let Obj = agencyList.find(x => x.agencyID === row.agencyID)
        if (typeof (Obj) !== 'undefined') {
            return Obj.agencyName;
        }
        else {
            return "";
        }
    };
    const getPaymentValue = (row) => {
        let Obj = paymentPurposeList.find(x => x.ppid === row.ppid)
        if (typeof (Obj) !== 'undefined') {
            return Obj.paymentPurpose;
        }
        else {
            return "-";
        }
    };

    const deleteRow = (indexToRemove) => {
        const newData = [...clearingAgencyList];
        newData.splice(indexToRemove, 1);
        setClearingAgencyList(newData);
    };

    const onhandleSubmit = () => {


        let model = {
            clearingID: clearingID,
            userID: user.id,
            agenciesClearingRequestModels: clearingAgencyList
        }
        AxiosService.insertClearingAgencyAmount(model).then((res) => {
            let { data, message } = res?.data;
            dispatch(
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: message === "Inserted successfully." ? "success" : "error"
                    },
                    close: true
                }))

            if (message === "Inserted successfully.") {
                setState(initialState)
                setClearingAgencyList([])
                if (isOpenFromModal) {
                    getClearingAgency()
                }
            }

        })
    }

    const getAgencyList = () => {

        AxiosService.getAgencyList().then((res) => {
            let { data } = res?.data;
            if (data) {
                setAgencyList(data)
            }
            else {
                setAgencyList([])
            }
        })
    }
    const getPaymentPurposeList = () => {

        AxiosService.getPaymentPurposeDropdown().then((res) => {
            let { data } = res?.data;
            if (data) {
                setPaymentPurposeList(data)
            }
            else {
                setPaymentPurposeList([])
            }
        })
    }

    useEffect(() => {

        getAgencyList()
        getPaymentPurposeList()

    }, [])

    return (
        <React.Fragment>
            <SubCard style={{ marginTop: "18px" }} title="Add Agencies" content={true} >
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <StyledTextField
                            value={agency.agencyID}
                            label="Agency"
                            onChange={handleAgencyChange}
                            size="small"
                            name="agencyID"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            select
                            error={!!errorAgency.agencyID}
                            helperText={errorAgency.agencyID}
                        >
                            {agencyList.length > 0 && agencyList.map((file, index) => (
                                <MenuItem key={index} value={file.agencyID}>
                                    {file.agencyName}
                                </MenuItem>
                            ))}
                        </StyledTextField>
                    </Grid>
                    <Grid item xs={6}>
                        <NumberFormat
                            format="########"
                            mask=""
                            fullWidth
                            error={!!errorAgency.amount}
                            helperText={errorAgency.amount}
                            customInput={TextField}
                            label="Amount"
                            onChange={handleAgencyChange}
                            value={agency.amount}
                            name="amount"
                            size='small'
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <StyledTextField
                            value={agency.ppid}
                            label="Payment Purpose"
                            onChange={handleAgencyChange}
                            size="small"
                            name="ppid"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            select
                            error={!!errorAgency.ppid}
                            helperText={errorAgency.ppid}
                        >
                            {paymentPurposeList.length > 0 && paymentPurposeList.map((item, index) => (
                                <MenuItem key={index} value={item.ppid}>
                                    {item.paymentPurpose}
                                </MenuItem>
                            ))}
                        </StyledTextField>
                    </Grid>
                    <Grid item xs={6}>
                        <SwitchCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-credit-card" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                                <path d="M3 10l18 0" />
                                <path d="M7 15l.01 0" />
                                <path d="M11 15l2 0" />
                            </svg>}
                            name={agency.ntn}
                            title="National Tax Number (NTN)"
                            handleChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <StyledTextField
                            value={agency.narration}
                            label="Narration"
                            onChange={handleAgencyChange}
                            size="small"
                            name="narration"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            error={!!errorAgency.narration}
                            helperText={errorAgency.narration}
                        >
                        </StyledTextField>
                    </Grid>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Button variant="contained" onClick={AddtoAgency} fullWidth startIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-text-plus" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M19 10h-14" />
                                <path d="M5 6h14" />
                                <path d="M14 14h-9" />
                                <path d="M5 18h6" />
                                <path d="M18 15v6" />
                                <path d="M15 18h6" />
                            </svg>
                        }>
                            Add to List
                        </Button>
                        <p style={{ color: '#f44336', margin: 0, marginTop: "12px" }}>{error.agenciesClearingRequestModels}</p>
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTableContainer>
                            <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
                                <StyledTableHead>
                                    <TableRow>
                                        <TableCell sx={{ pl: 1 }} style={{minWidth : "60px"}}>S No.</TableCell>
                                        <TableCell align="left">Agency</TableCell>
                                        <TableCell align="left">Amount</TableCell>
                                        <TableCell align="left" style={{minWidth : "150px"}}>Payment Purpose</TableCell>
                                        <TableCell align="left">NTN</TableCell>
                                        <TableCell align="left">Narration</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {clearingAgencyList.length > 0 && clearingAgencyList.map((row, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell sx={{ pl: 1 }} component="th" scope="row"><Typography variant="h6" style={{minWidth : "30px"}}>{index + 1}</Typography></TableCell>
                                            <TableCell align="left" style={{minWidth : "250px"}}><Typography variant="h6">{getAgencyValue(row) } {"A/C"} {customer} {row.ntn ? `(${ntn})` : " " } {getPaymentValue(row)} {row.narration} </Typography></TableCell>
                                            <TableCell align="left" style={{minWidth : "90px"}}><Typography variant="h6">{utilsJS.getFormattedAmount(row.amount)}</Typography></TableCell>
                                            <TableCell align="left" style={{minWidth : "120px"}}><Typography variant="h6">{getPaymentValue(row)}</Typography></TableCell>
                                            <TableCell align="left" style={{minWidth : "50px"}}><Typography variant="h6">{row.ntn ? "Yes" : "No"}</Typography></TableCell>
                                            <TableCell align="left" style={{minWidth : "200px"}}><Typography variant="h6">{row.narration || "-"}</Typography></TableCell>
                                            <TableCell align="center" style={{minWidth : "130px"}}>
                                                <Tooltip title="Edit Agency">
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => editRow(row, index)}
                                                    ><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-edit" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                                            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                                            <path d="M16 5l3 3" />
                                                        </svg>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Delete Agency">
                                                    <IconButton
                                                        aria-label="delete"
                                                        size="small"
                                                        onClick={() => deleteRow(index)}
                                                    ><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff4500" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                            <path d="M4 7l16 0" />
                                                            <path d="M10 11l0 6" />
                                                            <path d="M14 11l0 6" />
                                                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                                        </svg>
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </StyledTableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        {clearingID !== null && <Button disabled={clearingID !== null && isDisabled} variant="contained" style={{ marginTop: "20px", float: "right" }} onClick={handleSubmit}>
                            Update
                        </Button>}
                    </Grid>
                </Grid>
            </SubCard>
        </React.Fragment>
    );
}