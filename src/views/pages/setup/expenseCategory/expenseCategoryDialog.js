import React, { useState, useEffect } from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import AxiosService from "service";
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import NumberFormat from 'react-number-format';
import { expensecateoryInsert } from "validation"
import CustomDialog from "ui-component/CustomDialog";

export default function ExpenseCategoryDialog({ open, handleClose, item, getList }) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const [error, setError] = useState({})
    const [state, setState] = useState({
        expenseCategoryName: "",
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

            })
        }
        else {
            AxiosService.insertExpenseCategory(state).then((res) => {
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

            })
        }
    }

    const handleSubmit = () => {

        expensecateoryInsert
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
                    <TextField helperText={error.expenseCategoryName} error={!!error.expenseCategoryName} InputLabelProps={{ shrink: true }} fullWidth size="medium" onChange={handleChange} value={state.expenseCategoryName} name="expenseCategoryName" label="Expense Category Name" />
                </Grid>
            </Grid>
        </CustomDialog>

    );
}