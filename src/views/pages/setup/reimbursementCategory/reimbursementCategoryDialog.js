import React, { useState, useEffect } from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import AxiosService from "service";
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import NumberFormat from 'react-number-format';
import { reimbursmentCategoryInsert } from "validation"
import CustomDialog from "ui-component/CustomDialog";

export default function ReimbursementCategoryDialog({ open, handleClose, item, getList }) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const [error, setError] = useState({})
    const [state, setState] = useState({
        reimbursmentCategoryName: "",
    })

    const onhandleSubmit = () => {

        if (item) {
            AxiosService.updateReimbursementCategory(state).then((res) => {
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
                handleClose();
            })
        }
        else {
            AxiosService.insertReimbursementCategory(state).then((res) => {
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
                handleClose();
            })
        }
    }

    const handleSubmit = () => {

        reimbursmentCategoryInsert
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
            let { reimbursmentCategoryName, reimbursmentCategoryID } = item;
            setState({ reimbursmentCategoryName, reimbursmentCategoryID })
        }

    }, [item])

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={item ? "Update Reimbursement Category" : "Add Reimbursement Category"}
            fullWidth={true}
            maxWidth={"xs"}
            isAction={true}
            handleSubmit={handleSubmit}
            submitTitle={item ? "Update" : "Add"}
            Icon={item ? "edit" : "add"}
        >
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <TextField helperText={error.reimbursmentCategoryName} error={!!error.reimbursmentCategoryName} InputLabelProps={{ shrink: true }} fullWidth size="medium" onChange={handleChange} value={state.reimbursmentCategoryName} name="reimbursmentCategoryName" label="Reimbursement Category Name" />
                </Grid>
            </Grid>
        </CustomDialog>
    )

}