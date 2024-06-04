import React, { useState, useEffect } from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import AxiosService from "service";
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import NumberFormat from 'react-number-format';
import { paymentPurposeInsert } from "validation"
import CustomDialog from "ui-component/CustomDialog";

export default function PaymentPurposeDialog({ open, handleClose, item, getList }) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const [error, setError] = useState({})
    const [state, setState] = useState({
        paymentPurpose: "",
    })

    const onhandleSubmit = () => {

        if (item) {
            AxiosService.updateExpenseCategory(state).then((res) => {
                let { data, message } = res?.data;

                dispatch(
                    openSnackbar({
                        open: true,
                        message: message,
                        variant: 'alert',
                        alert: {
                            color: message === "Updated successfully." ? 'success' : "error"
                        },
                        close: true
                    })
                );
                getList();
                closeModal(message)
            })
        }
        else {
            AxiosService.insertPaymentPurpose(state).then((res) => {
                let { data, message } = res?.data;

                dispatch(
                    openSnackbar({
                        open: true,
                        message: message,
                        variant: 'alert',
                        alert: {
                            color: message === "Inserted successfully." ? 'success' : "error"
                        },
                        close: true
                    })
                );
                getList();
                closeModal(message)
            })
        }
    }

    const closeModal = (message) => {
        if(message === "Inserted successfully." || message === "pdated successfully."){
            handleClose()
        }
    }

    const handleSubmit = () => {

        paymentPurposeInsert
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


    const handleChange = (event) => {

        let { name, value } = event?.target;
        setState({ ...state, [name]: value })
        setError({ ...error, [name]: null })
    }

    useEffect(() => {

        if (item) {
            let { expenseCategoryName, expenseCategoryID } = item;
            setState({ expenseCategoryName, expenseCategoryID })
        }

    }, [item])

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={item ? "Update Expense Category" : "Add Expense Category"}
            fullWidth={true}
            maxWidth={"xs"}
            isAction={true}
            handleSubmit={handleSubmit}
            submitTitle={item ? "Update" : "Add"}
            Icon={item ? "edit" : "add"}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField helperText={error.paymentPurpose} error={!!error.paymentPurpose} InputLabelProps={{ shrink: true }} fullWidth size="medium" onChange={handleChange} value={state.paymentPurpose} name="paymentPurpose" label="Payment Purpose" />
                </Grid>
            </Grid>
        </CustomDialog>

    );
}