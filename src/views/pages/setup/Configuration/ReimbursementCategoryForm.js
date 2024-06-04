import React, { useState, useEffect } from 'react';
import { Grid, Avatar, TextField, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, IconButton, Tooltip, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import AutoComplete from 'ui-component/AutoComplete';
import AxiosServices from 'service';
import NumberFormat from 'react-number-format';
import { reimbursementCategory, reimbursementConfiguration } from "validation"
import AxiosService from "service"
import useAuth from 'hooks/useAuth';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import CustomDropdowns from "ui-component/CustomDropdowns";

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
const initialState = {
    reimbursmentCategoryID: 0,
    amount: "",
    clearingAgencyMapID: 0
}
// const initialState = {
//     clearingID: 0,
//     customTypeID: 1,
//     wharf: null,
//     shedNo: null,
//     userID: 0,
//     customerID: 0,
//     fileNo: "",
//     dailyExpenseCategoryModels: null
// }

export default function ReimbursementCategory({ clearingID = null, isDisabled = false }) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [error, setError] = useState({})
    const [state, setState] = useState(initialState)
    const [list, setList] = useState([])
    const [isClear, setisClear] = useState(false)
    const [isEdit, setisEdit] = useState(false)

    const onhandleAddAgency = () => {
        const newData = [
            ...list,
            { ...state, amount: parseFloat(state.amount) },
        ];
        setList(newData)
        setState(initialState)
        setisClear(true)
        setError({ ...error, reAmountMapModels: "" })
    }

    const handleAgencyChange = (event) => {

        let { value, name } = event?.target;
        setState({ ...state, [name]: value });
        setError((prevErrors) => ({
            ...prevErrors,
            [name]: null,
        }));
    }

    const AddtoAgency = () => {

        reimbursementCategory
            .validate(state, { abortEarly: false })
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
                setError(newErrors);
            });
    };

    const handleSubmit = () => {

        
        let model = {
            customerID: state.customerID,
            userID: user.id,
            reAmountMapModels: list.length > 0 ? list : null,
        }
        reimbursementConfiguration
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
        setState(row)
        deleteRow(index)
    };

    const deleteRow = (indexToRemove) => {
        const newData = [...list];
        newData.splice(indexToRemove, 1);
        setList(newData);
        setisEdit(true)
    };

    const onhandleSubmit = () => {
        

        const updatedReAmountMapModels = list.map(item => ({
            ...item,
            amount: -item.amount 
        }));

        let model = {
            clearingID: clearingID,
            userID: user.id,
            reAmountMapModels: updatedReAmountMapModels
        }
        
        AxiosService.insertReimbursmentCategoryAmount(model).then((res) => {
            let { data, message } = res?.data;
            debugger
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
                setList([])
                // setAgencyState(initialAgency)
                // setFileNoState(initialFileState)
                // setFileNoList([])
                // setSelectedOptionCustomer("")
            }

        })
    }

    // const getClearingAgency = () => {

    //     let model = {
    //         pagenumber: 1,
    //         pageSize: 10,
    //         clearingID: clearingID
    //     }

    //     AxiosService.getClearingAgency(model).then((res) => {

    //         let { data, message } = res?.data;
    //         if (data) {
                
    //             setClearingAgencyList(data[0].clearingAgencyAmounts)
    //         }
    //     })

    // }

    // useEffect(() => {
        
    //     if (clearingID) {
    //         getClearingAgency()
    //     }
    // }, [clearingID])

    return (
        <React.Fragment>
            <SubCard style={{ marginTop: "18px" }} title="Reimbursement Category Amount" content={true} >
                <Grid container spacing={2}>
                <CustomDropdowns
                    filter={state}
                    setFilter={setState}
                    FILTER_={initialState}
                    error={error}
                    setError={setError}
                    reimbursement={6}
                    isValidation={true}
                    isClearFromParent={isClear}
                    setisClear={setisClear}
                    isEdit={isEdit}
                    setisEdit={setisEdit}
                />
                    <Grid item xs={6}>
                        <NumberFormat
                            format="########"
                            mask=""
                            fullWidth
                            error={!!error.amount}
                            helperText={error.amount}
                            customInput={TextField}
                            label="Amount"
                            onChange={handleAgencyChange}
                            value={state.amount}
                            name="amount"
                            size='small'
                            InputLabelProps={{ shrink: true }}
                        />
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
                        <p style={{ color: '#f44336', margin: 0, marginTop: "12px" }}>{error.reAmountMapModels}</p>
                    </Grid>
                    <Grid item xs={12}>
                        <StyledTableContainer>
                            <Table sx={{ minWidth: 350 }} aria-label="simple table" size="small">
                                <StyledTableHead>
                                    <TableRow>
                                        <TableCell sx={{ pl: 3 }}>S No.</TableCell>
                                        <TableCell align="left">Reimburesment Category Name</TableCell>
                                        <TableCell align="left">Amount</TableCell>
                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </StyledTableHead>
                                <TableBody>
                                    {list.length > 0 && list.map((row, index) => (
                                        <TableRow hover key={index}>
                                            <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell>
                                            <TableCell align="left">{row.reimbursmentCategoryName}</TableCell>
                                            <TableCell align="left">{row.amount}</TableCell>
                                            <TableCell align="center">
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
                                                        disabled={row.clearingAgencyMapID !== 0}
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
                        {clearingID !== null && <Button disabled={clearingID !== 0 && isDisabled} variant="contained" style={{ marginTop: "20px", float: "right"}} onClick={handleSubmit}>
                            Update
                        </Button>}
                    </Grid>
                </Grid>
            </SubCard>
        </React.Fragment>
    );
}