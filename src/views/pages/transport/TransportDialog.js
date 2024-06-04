import React, { useState, useEffect } from 'react';
import { Grid, TextField, AppBar, Slide, Toolbar, DialogContent, DialogActions, IconButton, Tooltip, Dialog, Button, Typography, MenuItem, FormControl } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import utilsJS from "utilsJS";
import AxiosServices from "service";
import CloseIcon from '@mui/icons-material/Close';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { addTransport } from "validation"
import CustomDropdowns from "ui-component/CustomDropdowns";
import CustomDialog from "ui-component/CustomDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const initialState = {
    customerID: 0,
    clearingID: 0,
    transporterID: 0,
    userID: 0,
    remarks: ""
}

export default function TransportDialog({ open, handleClose, getList }) {

    const theme = useTheme();
    const { user } = useAuth();
    const [state, setState] = useState(initialState);
    const [error, setError] = useState({})
    const [file, setFile] = useState([]);
    const [isProcessing, setisProcessing] = useState(false);
    const dispatch = useDispatch();


    const handleChange = (event) => {

        let { value, name } = event?.target;
        setState({ ...state, [name]: value });
        setError({ ...error, [name]: null });
    }

    const handleSubmit = () => {

        let model = [{
            clearingID: state.clearingID,
            transporterID: state.transporterID,
            userID: user.id,
            remarks: state.remarks
        }]

        setisProcessing(true)
        AxiosServices.assignTransport(model).then(data => {

            const { message } = data?.data

            dispatch(
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: message === "Transport assigned successfully." ? "success" : "error"
                    },
                    close: true
                })
            );

            if (message === "Transport assigned successfully.") {
                getList()
                handleClose()
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

        addTransport
            .validate(state, { abortEarly: false })
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

        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={"Assign Transport"}
            fullWidth={true}
            maxWidth={"sm"}
            isAction={true}
            handleSubmit={onSubmit}
            submitTitle={"Submit"}
            Icon={"add"}
            disabled={isProcessing}
        >
            <Grid container spacing={2} alignItems="center">

                <CustomDropdowns
                    filter={state}
                    setFilter={setState}
                    FILTER_={initialState}
                    customer={4}
                    fileTransport={4}
                    transport={4}
                    error={error}
                    setError={setError}
                    isValidation={true}
                />

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

            </Grid>
        </CustomDialog>
    );
}