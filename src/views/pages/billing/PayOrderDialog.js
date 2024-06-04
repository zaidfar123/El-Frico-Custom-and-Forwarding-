import React, { useState, useEffect } from 'react';
import { Grid, TextField, AppBar, Slide, Toolbar, DialogContent, DialogActions, IconButton, Tooltip, Dialog, Button, Typography, MenuItem, FormControl } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import InvoiceViewer from "./InvoiceViewer";
import CustomDuty from "../setup/Configuration/CustomDuty"
// import "./style.css";
import ClearingAgencyForm from "../setup/Configuration/ClearingAgencyForm";
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';
import utilsJS from "utilsJS";
import AxiosServices from "service";
import CustomFileUploader from "ui-component/FileUploader"
import AutoComplete from 'ui-component/AutoComplete';
import CloseIcon from '@mui/icons-material/Close';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { advancePayOrder } from "validation"
import CustomDropdowns from "ui-component/CustomDropdowns";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));

const initialState = {
    customerID: 0,
    ocrid: 0,
    TransferCategoryID: 0,
    Remarks: "",
    AdvanceAmount: "",
    PayorderNo: "",
    PayorderDate: dayjs(new Date())
}

export default function PayOrderDialog({ open, handleClose }) {

    const theme = useTheme();
    const { user } = useAuth();
    const [FileNoList, setFileNoList] = useState([])
    const [transferCategoryList, setTransferCategoryList] = useState([])
    const [state, setState] = useState(initialState);
    const [error, setError] = useState({})
    const [file, setFile] = useState([]);
    const [isProcessing, setisProcessing] = useState(false);
    const dispatch = useDispatch();

    const getTransferCategoryList = () => {

        AxiosServices.getTransferCategoryList().then((res) => {
            let { data, message } = res?.data;
            if (data) {
                setTransferCategoryList(data)
            }
            else {
                setTransferCategoryList([])
            }
        })
    }

    useEffect(() => {

        getTransferCategoryList()

    }, [])

    const handleChange = (event) => {

        let { value, name } = event?.target;
        setState({ ...state, [name]: value });
        setError({ ...error, [name]: null });
    }

    const handleDate = (date) => {
        setState({ ...state, PayorderDate: date });
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

        const formdata = new FormData();
        formdata.append("OCRID", state.ocrid);
        formdata.append("UserID", user.id);
        formdata.append("TransferCategoryID", state.TransferCategoryID);
        formdata.append("Remarks", state.Remarks);
        formdata.append("AdvanceAmount", parseFloat(state.AdvanceAmount));
        formdata.append("PayorderNo", state.PayorderNo);
        formdata.append("PayorderDate", dayjs(state.PayorderDate).format("YYYY-MM-DD"));
        Array.from(file).map((item) => {
            formdata.append("file", item);
        })
        setisProcessing(true)
        AxiosServices.insertAdvancePayorder(formdata).then(data => {
            const { message } = data?.data

            if (message === "The Advance payment feed has been processed successfully.") {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: message,
                        variant: 'alert',
                        alert: {
                            color: "success"
                        },
                        close: true
                    })
                );
                setFile([])
                handleClose()
            }
            else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: message,
                        variant: 'alert',
                        alert: {
                            color: "error"
                        },
                        close: true
                    })
                );
            }
            setisProcessing(false)
        })
            .catch(e => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Something went wrong",
                        variant: 'alert',
                        alert: {
                            color: "error"
                        },
                        close: true
                    })
                );
                console.error(e);
                setisProcessing(false)

            });
    }

    const onSubmit = () => {

        let model = {
            customerID: state.customerID,
            TransferCategoryID: state.TransferCategoryID,
            ocrid: state.ocrid,
            AdvanceAmount: state.AdvanceAmount
        }

        advancePayOrder
            .validate(model, { abortEarly: false })
            .then(() => {
                handleSubmit()
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
    }

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
                TransitionComponent={Transition}
            >
                <AppBar position="sticky">
                    <Toolbar style={{ justifyContent: "space-between", background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, padding: "8px" }}>
                        <Typography variant="h4">
                            Add PayOrder
                        </Typography>

                        <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={handleClose}
                        >
                            <CloseIcon fontSize="small" color="primary" />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{ padding: "20px" }}>
                    <Grid container spacing={2} alignItems="center">

                        <Grid item xs={4}>
                            <TextField fullWidth error={!!error.PayorderNo} helperText={error.PayorderNo} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.PayorderNo} name="PayorderNo" label="Pay Order No" />
                        </Grid>

                        <Grid item xs={4} >
                            <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <MobileDatePicker onChange={handleDate} name="PayorderDate" size="small" value={state.PayorderDate} defaultValue={state.PayorderDate} InputLabelProps={{ shrink: true }} label="Pay Order Date" />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <CustomDropdowns
                            filter={state}
                            setFilter={setState}
                            FILTER_={initialState}
                            customer={4}
                            ocridAD={4}
                        />

                        <Grid item xs={4}>
                            <TextField
                                value={state.TransferCategoryID}
                                label="Transfer Category"
                                onChange={handleChange}
                                size="small"
                                name="TransferCategoryID"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                select
                                error={!!error.TransferCategoryID}
                                helperText={error.TransferCategoryID}
                            >
                                {transferCategoryList.length > 0 && transferCategoryList.map((item, index) => (
                                    <MenuItem key={index} value={item.transferCategoryID}>
                                        {item.transferCategoryName}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </Grid>

                        <Grid item xs={4}>
                            <TextField fullWidth error={!!error.AdvanceAmount} helperText={error.AdvanceAmount} InputLabelProps={{ shrink: true }} size="small" onChange={handleChangeNumber} value={state.AdvanceAmount} name="AdvanceAmount" label="Amount" />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                value={state.Remarks}
                                label="Remarks"
                                onChange={handleChange}
                                size="small"
                                name="Remarks"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            >
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <CustomFileUploader file={file} setFile={setFile} setError={setError} error={error} />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' disabled={isProcessing} onClick={onSubmit} >Submit</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}