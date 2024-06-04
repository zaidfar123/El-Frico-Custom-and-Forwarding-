import React, { useState, useEffect } from 'react';
import { Grid, Avatar, TextField, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, IconButton, Tooltip, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import AutoComplete from 'ui-component/AutoComplete';
import AxiosServices from 'service';
import NumberFormat from 'react-number-format';
import { clearingAgency, agencyConfiguration } from "validation"
import AxiosService from "service"
import useAuth from 'hooks/useAuth';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import ExpenseDistributionForm from "./ExpenseDistributionForm"
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
    // background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
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
    amount: "",
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
const initialFileState = {
    refNo: "",
    nameOfImporter: "",
    vesselName: "",
    noOfPkgs: "",
    descriptionOfGoods: "",
    shedNo: "",
    wharf: "",
    clearingID: 0
}
export default function ExpenseDistribution() {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [error, setError] = useState({})
    const [state, setState] = useState(initialState);
    const [isClear, setisClear] = useState(false);
    const [fileNoState, setFileNoState] = useState(initialFileState)


    const getCustomerDetailForExpense = () => {

        let model = { fileNo: state.fileNo }
        AxiosService.getCustomerDetailForExpense(model).then((res) => {
            let { data } = res?.data;
            if (data) {
                setFileNoState(data)
            }
            else {
                setFileNoState({})
            }
        })
    }

    useEffect(() => {

        if (state.fileNo !== "") {
            getCustomerDetailForExpense()
        }

    }, [state.fileNo])

    return (
        <React.Fragment>
            <MainCard title="Expense Amount Distribution">
                {/* <Grid container spacing={2}>
                    <CustomDropdowns
                        filter={state}
                        setFilter={setState}
                        FILTER_={initialState}
                        customer={6}
                        fileno={6}
                        isClearFromParent={isClear}
                        setisClear={setisClear}
                    />
                </Grid> */}
                <ExpenseDistributionForm clearingID={typeof (fileNoState.clearingID) === "undefined" ? null : fileNoState.clearingID} />
            </MainCard>

        </React.Fragment>
    );
}