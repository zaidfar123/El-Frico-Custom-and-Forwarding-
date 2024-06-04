import React, { useState, useEffect } from 'react';
import { Grid, Avatar, TextField, Button, InputLabel, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, IconButton, Tooltip, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import AutoComplete from 'ui-component/AutoComplete';
import AxiosServices from 'service';
import { expenseList, dailyExpense } from "validation"
import AxiosService from "service"
import useAuth from 'hooks/useAuth';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import CustomDropdowns from "ui-component/CustomDropdowns";
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
const initialExpense = {
    expenseCategoryID: null,
    amount: "",
    file: null,
    expenseOption: null,
    preview: null,
    clearingID : 0
}
const initialState = {
    clearingID: 0,
    customTypeID: 0,
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
    clearingID: 0,
    amountInHand: 0
}

var amountLimit = 0;

export default function DailyExpense() {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [error, setError] = useState({})
    const [state, setState] = useState(initialState);
    const [expList, setExpenseList] = useState([])
    const [expense, setExpense] = useState(initialExpense)
    const [errorExpense, setErrorExpense] = useState({})
    const [fileNoState, setFileNoState] = useState(initialFileState)
    const [FileNoList, setFileNoList] = useState([])
    const [amountList, setAmountList] = useState([])
    const [isClear, setisClear] = useState(false)
    const [amountLimit, setamountLimit] = useState(0)

    const OptionExpenseDescription = (option) => option.expenseCategoryName || "";
    const [selectedOptionExpense, setSelectedOptionExpense] = useState("");

    const setOptionsChanges = (options, field) => {
        
        if (options) {
            if (field === "expenseCategoryID") {
                setExpense({ ...expense, [field]: options[field], expenseOption: options.expenseCategoryName });
                setErrorExpense((prevErrors) => ({
                    ...prevErrors,
                    [field]: null,
                }));
            }
            else {
                setState({ ...state, [field]: options.customerID, fileNo: "" })
                setFileNoState(initialFileState)
            }
        } else {
            if (field === "expenseCategoryID") {
                setExpense({ ...expense, [field]: null });
                setErrorExpense((prevErrors) => ({
                    ...prevErrors,
                    [field]: null,
                    expenseCategoryName: null
                }));
            }
            else {
                setState({ ...state, [field]: 0, fileNo: "" })
                setFileNoState(initialFileState)

            }
        }
        setError((prevErrors) => ({
            ...prevErrors,
            [field]: null,
        }));

    };

    const handleChange = (event) => {
        let { value, name } = event?.target;
        setState({ ...state, [name]: value });
        setError({ ...error, [name]: "" });
    }

    const handleExpenseChange = (event) => {

        let { value, name } = event?.target;

        const isValidInput = /^[+-]?\d+(\.\d*)?$/.test(value);
        
        if (isValidInput || value === '') {

            if (value === "") {
                setExpense({ ...expense, [name]: value });
            }
            else {
                let Remainingamount = getRemainingAmount();
                if (parseFloat(value) <= Remainingamount) {
                    setExpense({ ...expense, [name]: value });
                }
            }

            setErrorExpense((prevErrors) => ({
                ...prevErrors,
                [name]: null,
            }));
        }
    }

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
      
        if (selectedFile) {
          const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
          if (acceptedTypes.includes(selectedFile.type)) {
            // Check if it's the same file before proceeding
            if (!expense.file || expense.file.name !== selectedFile.name || expense.file.size !== selectedFile.size) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setExpense({ ...expense, file: selectedFile, preview: reader.result });
              };
              reader.readAsDataURL(selectedFile);
              setErrorExpense((prevErrors) => ({ ...prevErrors, file: null, }));
              event.target.value = '';
            }
          } else {
            console.log('Unsupported file format. Please upload a JPG, JPEG, or PNG file.');
          }
        }
      };
      

    const onhandleAddExpense = () => {

        const newData = [
            ...expList,
            { ...expense, amount: parseFloat(expense.amount) , fileNo : fileNoState.refNo   },
        ];

        // if(isRemainingAmountAlreadyExists()){

        //     setAmountList(updateRemainingAmount(fileNoState.clearingID , expense.amount, "add"))
        // }
        // else{
        //     const newAmountData = [
        //         ...amountList,
        //         { id : fileNoState.clearingID, amount: parseFloat(expense.amount) },
        //     ];

        //     setAmountList(newAmountData)
        // }
        
        
        let remainingAmount = amountLimit - parseFloat(expense.amount);
        setamountLimit(remainingAmount)
        setExpenseList(newData)
        setExpense(initialExpense)
        setError({ ...error, dailyExpenseCategoryModels: "" })
    }

    const AddtoExpense = () => {
        expenseList
            .validate(expense, { abortEarly: false })
            .then(() => {
                onhandleAddExpense()
            })
            .catch((err) => {
                // if state is invalid, update Errors state with error messages
                const newErrors = {};
                if (err && err.inner) {
                    err.inner.forEach((error) => {
                        newErrors[error.path] = error.message;
                    });
                }
                setErrorExpense(newErrors);
            });
    };

    const handleSubmit = () => {
        let model = {
            customerID: state.customerID,
            fileNo: state.fileNo,
            dailyExpenseCategoryModels: expList.length > 0 ? expList : null,
        }
        dailyExpense
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
        setExpense(row)
        setSelectedOptionExpense({ expenseCategoryName: row.expenseOption })
        deleteRow(index,row)
    };

    const deleteRow = (indexToRemove,row) => {

        let remainingAmount = amountLimit + parseFloat(row.amount);
        setamountLimit(remainingAmount)

        // setAmountList(updateRemainingAmount(row.clearingID , row.amount, "sub"))
        const newData = [...expList];
        newData.splice(indexToRemove, 1);
        setExpenseList(newData);
    };

    const removeFile = () => {
        setExpense({ ...expense, file: null, preview: null });
    };


    const onhandleSubmit = () => {

        setisClear(false)
        
        let dailyExpenseCategoryModels = [];

        
        expList.map((x) => {
            dailyExpenseCategoryModels.push({
                expenseCategoryID: x.expenseCategoryID,
                amount: x.amount,
                base64String: x.preview
            })
        })
        
        let model = {
            clearingID: fileNoState.clearingID,
            userID: user.id,
            dailyExpenseCategoryModels: dailyExpenseCategoryModels
        }
        AxiosService.insertDailyExpense(model).then((res) => {
            let { data, message } = res?.data;

            dispatch(
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: message === "Insert Successfully." ? "success" : "error"
                    },
                    close: true
                }))

            if (message === "Insert Successfully.") {
                setState(initialState)
                setExpenseList([])
                setExpense(initialExpense)
                setFileNoState(initialFileState)
                setisClear(true)
                // setFileNoList([])
                setSelectedOptionExpense("")
                // setSelectedOptionCustomer("")
            }

        })
    }

    const getCustomerDetailForExpense = () => {

        let model = { fileNo: state.fileNo, userID: user.id }
        AxiosService.getCustomerDetailForExpense(model).then((res) => {
            let { data } = res?.data;
            if (data) {

                setFileNoState(data)
                let totalAmount = 0;
                expList.forEach((x) => {  totalAmount += x.amount});

                if(totalAmount === 0){
                    setamountLimit(data.amountInHand)
                }
                else{
                    setamountLimit(data.amountInHand - totalAmount)
                }
            }
            else {
                setFileNoState({})
            }
        })
    }


    useEffect(() => {

        if (state.fileNo !== "" && state.customerID !== 0) {
            getCustomerDetailForExpense()
        }
        else{
            setFileNoState(initialFileState)
            setExpense(initialExpense)
            setamountLimit(0)
        }

        if(state.customerID === 0){
            setisClear(true)
        }

    }, [state.fileNo, state.customerID])

    const getRemainingAmount = () => {

        
        if (isRemainingAmountAlreadyExists()) {
            let amountObj = amountList.find(x => x.id === fileNoState.clearingID)
            return parseFloat(amountLimit) - parseFloat(amountObj.amount)
        }
        else {
            return parseFloat(amountLimit)
        }

    }

    const isRemainingAmountAlreadyExists = () => {

        let amountObj = amountList.find(x => x.id === fileNoState.clearingID)
        return typeof(amountObj) !== "undefined"
    }

    const updateRemainingAmount = (clearingId,amount,action) => {

        const updatedArray = amountList.reduce((acc, obj) => {
            if (obj.id === clearingId) {
              return [...acc, { ...obj, amount : action === "add" ? obj.amount + parseFloat(amount) : obj.amount - parseFloat(amount) }];
            } else {
              return [...acc, obj];
            }
          }, []);

          return updatedArray;
    }

    return (
        <React.Fragment>
            <MainCard title="Daily Expense Management">
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <StyledTextField disabled={true} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={new Date().toLocaleDateString()} name="userName" label="Date" />
                    </Grid>
                    <CustomDropdowns
                        filter={state}
                        setFilter={setState}
                        FILTER_={initialState}
                        customer={3}
                        fileno={3}
                        isValidation={true}
                        error = {error}
                        setError = {setError}
                        isClearFromParent = {isClear}
                        setisClear={setisClear}
                    />
                    <Grid item xs={3}>
                        <StyledTextField disabled={true} helperText={error.refNo} error={!!error.refNo} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={fileNoState.refNo} name="refNo" label="Ref No" />
                    </Grid>
                    <Grid item xs={3}>
                        <StyledTextField disabled={true} helperText={error.nameOfImporter} error={!!error.nameOfImporter} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={fileNoState.nameOfImporter} name="nameOfImporter" label="Name of Importer" />
                    </Grid>
                    <Grid item xs={3}>
                        <StyledTextField disabled={true} helperText={error.vesselName} error={!!error.vesselName} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={fileNoState.vesselName} name="vesselName" label="Vesel Name" />
                    </Grid>
                    <Grid item xs={3}>
                        <StyledTextField disabled={true} helperText={error.wharf} error={!!error.wharf} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={fileNoState.wharf} name="wharf" label="Wharf" />
                    </Grid>
                    <Grid item xs={3}>
                        <StyledTextField disabled={true} helperText={error.shedNo} error={!!error.shedNo} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={fileNoState.shedNo} name="shedNo" label="Shed No" />
                    </Grid>
                    <Grid item xs={3}>
                        <StyledTextField disabled={true} helperText={error.noOfPkgs} error={!!error.noOfPkgs} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={fileNoState.noOfPkgs} name="noOfPkgs" label="No of Pkgs" />
                    </Grid>
                    <Grid item xs={3}>
                        <StyledTextField disabled={true} InputLabelProps={{ shrink: true }} fullWidth size="small" value={utilsJS.getFormattedAmount(fileNoState.amountInHand)} name="amountInHand" label="Amount in Hand" />
                    </Grid>
                    <Grid item xs={6}>
                        <StyledTextField disabled={true} helperText={error.descriptionOfGoods} error={!!error.descriptionOfGoods} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={fileNoState.descriptionOfGoods} name="descriptionOfGoods" label="Description of Goods" />
                    </Grid>
                </Grid>
                <SubCard style={{ marginTop: "18px" }} title="Daily Expense" content={true} >
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <AutoComplete
                                setOptionsChanges={setOptionsChanges}
                                state={expense}
                                errors={errorExpense}
                                selectedOption={selectedOptionExpense}
                                setSelectedOption={setSelectedOptionExpense}
                                searchSuggestions={AxiosServices.searchExpense}
                                getOptionLabel={OptionExpenseDescription}
                                field={"expenseCategoryID"}
                                label={"Expense"}
                                disabled={false}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <StyledTextField
                                fullWidth
                                error={!!errorExpense.amount}
                                helperText={errorExpense.amount}
                                label="Amount"
                                onChange={handleExpenseChange}
                                value={expense.amount}
                                name="amount"
                                size='small'
                                InputLabelProps={{ shrink: true }}
                                disabled={amountLimit === 0 || amountLimit === "0"}
                            />
                            {amountLimit !== 0 &&
                                <Typography variant="caption">
                                  You are left with {utilsJS.getFormattedAmount(amountLimit)} in hand amount.
                                </Typography>
                            }
                        </Grid>
                        <Grid item xs={4}>
                            <Button style={{ borderColor: !!errorExpense.file ? "#f44336" : "inherit" }} component="label" variant="outlined" fullWidth startIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cloud-upload" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                                    <path d="M9 15l3 -3l3 3" />
                                    <path d="M12 12l0 9" />
                                </svg>
                            }>
                                <VisuallyHiddenInput onChange={handleFileUpload} type="file" accept=".jpg, .jpeg, .png" />
                                Upload Document
                            </Button>
                            <span style={{ color: '#f44336' }}>{errorExpense.file}</span>
                        </Grid>
                        <Grid item xs={12}>
                            {expense.preview && (
                                <Card className='Image-preview' style={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}>
                                    <CardMedia component="img" image={expense.preview} alt="File Preview" />
                                    <div>
                                        <Typography variant="title" align="center">
                                            {expense.file.name}
                                        </Typography>
                                        <Typography variant="caption" align="center">
                                            {(expense.file.size / (1024 * 1024)).toFixed(2)} {"MB"}
                                        </Typography>
                                    </div>
                                    <Tooltip title="Remove">
                                        <IconButton onClick={removeFile}>
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg>
                                        </IconButton>
                                    </Tooltip>

                                </Card>
                            )}
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Button disabled={getRemainingAmount() === 0 || getRemainingAmount === "0"} variant="contained" onClick={AddtoExpense} fullWidth startIcon={
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
                            <p style={{ color: '#f44336', margin: 0, marginTop: "12px" }}>{error.dailyExpenseCategoryModels}</p>
                        </Grid>
                    </Grid>
                </SubCard>
                <SubCard style={{ marginTop: "12px" }} title="Daily Expense List" content={false} >
                    <Grid container spacing={2} sx={{ my: 0 }}>
                        <Grid item xs={12}>
                            <StyledTableContainer>
                                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                    <StyledTableHead>
                                        <TableRow>
                                            <TableCell sx={{ pl: 2 }}>S No.</TableCell>
                                            <TableCell align="left">File No</TableCell>
                                            <TableCell align="left">Expense</TableCell>
                                            <TableCell align="left">Amount</TableCell>
                                            <TableCell align="left">File</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </StyledTableHead>
                                    <TableBody>
                                        {expList.length > 0 && expList.map((row, index) => (
                                            <TableRow hover key={index}>
                                                <TableCell sx={{ pl: 2 }} component="th" scope="row"><Typography variant="h6">{index + 1}</Typography></TableCell>
                                                <TableCell align="left"><Typography variant="h6">{row.fileNo}</Typography></TableCell>
                                                <TableCell align="left"><Typography variant="h6">{row.expenseOption}</Typography></TableCell>
                                                <TableCell align="left"><Typography variant="h6">{utilsJS.getFormattedAmount(row.amount)}</Typography></TableCell>
                                                <TableCell align="left"><Avatar src={row.preview} size="md" variant="rounded" /></TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Edit Expense">
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
                                                    <Tooltip title="Delete Expense">
                                                        <IconButton
                                                            aria-label="delete"
                                                            size="small"
                                                            onClick={() => deleteRow(index,row)}
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
                    </Grid>
                </SubCard>
                <Grid item xs={12}>
                    <Button variant="contained" style={{ margin: "20px 0 20px 0", alignItems: "right", float : "right" }} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Grid>
            </MainCard>

        </React.Fragment>
    );
}