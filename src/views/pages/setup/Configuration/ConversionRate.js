import React, { useState, useEffect } from 'react';
import { Grid, Avatar, TextField, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, IconButton, Tooltip, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import {conversionRate } from "validation"
import AxiosService from "service"
import useAuth from 'hooks/useAuth';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import CurrencyList from 'currency-list'
import CustomSelect from 'ui-component/CustomSelect';

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    // background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
}));
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    // borderRadius: "6px"
}));


const initialState = {
    conversionUnitName: "",
    conversionRate: ""
}

export default function ConversionRate() {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [error, setError] = useState({})
    const [state, setState] = useState(initialState);
    const [list, setList] = useState([]);
    const [currencyList, setCurrencyList] = useState([]);

    const handleChange = (event) => {
        let { value, name } = event?.target;
        setState({ ...state, [name]: value });
        setError({ ...error, [name]: "" });
    }
 
    const handleChangeNumber = (event) => {
        let { name, value } = event.target;
        const isValidInput = /^[+-]?\d+(\.\d*)?$/.test(value);
        if (isValidInput || value === '') {
            setState({ ...state, [name]: value });
            setError({ ...error, [name]: null });
        }
    }

    const handleSubmit = () => {
    
        conversionRate
            .validate(state, { abortEarly: false })
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


    const onhandleSubmit = () => {
 
        AxiosService.insertConversionRate(state).then((res) => {
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
                getConversionRateList()
            }

        })
    }

    const getConversionRateList = () => {

        AxiosService.getConversionRateList({conversionUnitName : null}).then((res) => {
            let { data } = res?.data;
            if (data) {
                setList(data)
            }
            else {
                setList([])
            }
        })
    }

    useEffect(() => {
       getConversionRateList()
    }, [])

    useEffect(() => {

        let a = CurrencyList.getAll()
        setCurrencyList(a.af)
    }, [])

    return (
        <React.Fragment>
            <MainCard title="Conversion Rate Setup">
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <CustomSelect
                            generateList={false}
                            label="Conversion Unit"
                            onChange={handleChange}
                            size="small"
                            name="conversionUnitName"
                            InputLabelProps={{ shrink: true }}
                            state={state}
                            disabled={false}
                            setState={setState}
                            isInt={false}
                            error={error}
                            options={Object.keys(currencyList).map((currencyCode) => (
                                {
                                    value: currencyList[currencyCode].code,
                                    label: currencyList[currencyCode].code + " " + `(${currencyList[currencyCode].symbol_native})`,
                                }
                            ))}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth error={!!error.conversionRate} helperText={error.conversionRate} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.conversionRate} name="conversionRate" size="small" label="Conversion Rate" />
                    </Grid>
                    <Grid item xs={12}>
                    <Button variant="contained" style={{ marginTop: "20px", float: "right" }} onClick={handleSubmit}>
                        Add
                    </Button>
                </Grid>
                </Grid>
                <SubCard style={{ marginTop: "12px" }} title="Conversion Rate List" content={false} >
                    <Grid container spacing={2} sx={{ my: 0 }}>
                        <Grid item xs={12}>
                            <StyledTableContainer>
                                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                    <StyledTableHead>
                                        <TableRow>
                                            <TableCell sx={{ pl: 3 }}>S No.</TableCell>
                                            <TableCell align="left">Conversion Unit Name</TableCell>
                                            <TableCell align="left">Conversion Rate</TableCell>
                                        </TableRow>
                                    </StyledTableHead>
                                    <TableBody>
                                        {list.length > 0 && list.map((row, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell>
                                                <TableCell align="left">{row.conversionUnitName}</TableCell>
                                                <TableCell align="left">{row.conversionRate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </StyledTableContainer>
                        </Grid>
                    </Grid>
                </SubCard>
            </MainCard>

        </React.Fragment>
    );
}