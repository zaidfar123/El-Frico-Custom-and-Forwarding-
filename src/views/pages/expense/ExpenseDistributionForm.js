import React, { useState, useEffect } from 'react';
import { Grid, Box, Checkbox, Autocomplete, TextField, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, IconButton, Tooltip, CardMedia, Card, Chip } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import NumberFormat from 'react-number-format';
import { expenseDistribution } from "validation"
import AxiosService from "service"
import useAuth from 'hooks/useAuth';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import utilsJS from "utilsJS";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CustomDropdowns from "ui-component/CustomDropdowns";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    // borderRadius: "6px"
}));


const INITIAL_STATE = {
    userID: 0,
    amount: "",
    narration: ""
}
export default function ExpenseDistributionForm({ clearingID = null }) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [expenseTable, setexpenseTable] = useState([])
    const [list, setList] = useState([])
    const [amount, setAmount] = useState({
        assignedAmountTotal: 0,
        approvedExpenseAmountTotal: 0,
        inProcessExpenseAmountTotal: 0,
        amountInHandTotal: 0,
    })

    const [error, setError] = useState({})
    const [errorList, setListError] = useState(null)
    const [isLoading, setisLoading] = useState(false);

    //State for Add expense
    const [state, setState] = useState(INITIAL_STATE)

    const handleChange = (event) => {
        let { value, name } = event?.target;
        setState({ ...state, [name]: value })
    }

    const AddtoList = () => {

        expenseDistribution
            .validate(state, { abortEarly: false })
            .then(() => {
                onhandleSubmit()
            })
            .catch((err) => {
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

        AxiosService.assignedExpenseAmount([{
            assignedUserID: user.id,
            amount: state.amount,
            clearingID: clearingID,
            userID: user.id
        }]).then((res) => {
            let { data, message } = res?.data;
            dispatch(
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: message === "Assigned successfully." ? "success" : "error"
                    },
                    close: true
                }))

            if (message === "Assigned successfully.") {
                // setexpenseTable([])
                // setEmployees([])
                // setState(INITIAL_STATE)
                getList()
            }

        })
    }

    const getList = () => {

        setisLoading(true);

        AxiosService.getAssignedAmountExpenseList({ ...state, pageNumber: 1, pageSize: 10, assignedUserID: user.id, fileNo: null, userID: 0 }).then((res) => {
            let { data, totalCount } = res?.data;

            setisLoading(false);

            if (data) {
                setList(data[0].employeeAssignedAmountModels);
                setAmount(data[0])
            }
            else {
                setList([]);
            }
        })
    }

    useEffect(() => {
        getList()
    }, [state])

    const backgroundStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light
    }


    return (
        <React.Fragment>
            <SubCard title="Add Expense" content={true} >
                <Grid container spacing={2}>
                    <CustomDropdowns
                        filter={state}
                        setFilter={setState}
                        FILTER_={INITIAL_STATE}
                        // employee={5}
                        amount={5}
                        error={error}
                        setError={setError}
                        isValidation={true}
                    />
                    <Grid item xs={5} style={{ textAlign: "center" }}>
                        <TextField
                            name="narration"
                            value={state.narration}
                            onChange={handleChange}
                            fullWidth
                            size='small'
                            InputLabelProps={{ shrink: true }}
                            label="Narrative"
                        >

                        </TextField>
                    </Grid>

                    <Grid item xs={2}>
                        {<Button variant="contained" fullWidth onClick={AddtoList}>
                            Submit
                        </Button>}
                    </Grid>
                </Grid>

                <div style={{ overflowX: 'auto' }}>
                    <Box sx={{ mt: 2, padding: "6px", border: "1px solid", borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, borderRadius: "4px" }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Expense Distribution Details
                        </Typography>
                        <Table size="small" aria-label="purchases">
                            <TableHead sx={backgroundStyle}>
                                <TableRow>
                                    <TableCell style={{ minWidth: 40 }} align="left">S No</TableCell>
                                    <TableCell style={{ minWidth: 150 }} align="left">Issuer</TableCell>
                                    <TableCell style={{ minWidth: 130 }} align="left">Date</TableCell>
                                    <TableCell style={{ minWidth: 130 }} align="left">Status</TableCell>
                                    <TableCell style={{ minWidth: 150 }} align="right">Assigned Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list.length > 0 && list.map((catRow, index) => (
                                    <TableRow hover key={index}>
                                        <TableCell style={{ minWidth: 40 }} align="left">
                                            <Typography variant="h6" >
                                                {index + 1}
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ minWidth: 40 }} align="left">
                                            <Typography variant="h6" >
                                                {catRow.issuerPerson}
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ minWidth: 100 }} align="left">
                                            <Typography variant="h6" >
                                                {catRow.assignedAmountDate}
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ minWidth: 100 }} align="left">
                                            <Typography variant="h6" >
                                                <Chip size="small" variant="outlined" color='primary' label={catRow.assignedStatus} />
                                            </Typography>
                                        </TableCell>
                                        <TableCell style={{ minWidth: 40 }} align="right">
                                            <Typography variant="h6" >
                                                {utilsJS.getFormattedAmount(catRow.assignedAmount)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {list.length > 0 && <>
                                    <AmountRow title={"Assigned Amount:"} amount={amount.assignedAmountTotal} />
                                    <AmountRow title={"Pending Amount:"} amount={amount.pendingAmountTotal} />
                                    <AmountRow title={"Approved Amount:"} amount={amount.approvedAmountTotal} />
                                    <AmountRow title={"Released Amount:"} amount={amount.releasedAmountTotal} />
                                    <AmountRow title={"Approved Expense Amount:"} amount={amount.approvedExpenseAmountTotal} />
                                    <AmountRow title={"In Process Expense Amount:"} amount={amount.inProcessExpenseAmountTotal} />
                                    <AmountRow title={"In Hand Amount:"} amount={amount.amountInHandTotal} />
                                </>}
                                {list.length == 0 &&
                                    <TableRow key={-1}>
                                        <TableCell style={{ minWidth: 40 }} align="center" colSpan={12}>
                                            <Typography variant="h6" >
                                                No record found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </Box>
                </div>
            </SubCard>
        </React.Fragment>
    );
}


export const AmountRow = ({title,amount}) => {

    const theme = useTheme();

    const fontStyle = {
        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
    }
    const backgroundStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light
    }

    return (
        <TableRow key={title} sx={backgroundStyle}>
            <TableCell style={{ minWidth: 40 }} align="right" colSpan={12}>
                <div style={{ display: 'flex', gap: "12px", justifyContent: "space-between" }}>
                    <Typography variant="h6" >
                        {title}
                    </Typography>
                    <Typography variant="h6" style={fontStyle} >
                        {"Rs: "}{utilsJS.getFormattedAmount(amount)}
                    </Typography>
                </div>
            </TableCell>
        </TableRow>
    )

}