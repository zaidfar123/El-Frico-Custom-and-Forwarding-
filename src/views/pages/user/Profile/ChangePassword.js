// material-ui
import React, { useState } from "react"
import { useTheme } from '@mui/material/styles';
import { Alert, AlertTitle, Button, Grid, TextField } from '@mui/material';
import { changePassword } from "validation"

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import useAuth from 'hooks/useAuth';
import AxiosService from "service"
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';

// ==============================|| PROFILE 1 - CHANGE PASSWORD ||============================== //
const InitialState = {
    password: "",
    oldPassword: "",
    RePassword: "",
}

const ChangePassword = () => {

    const { user } = useAuth();
    const [error, setError] = useState({})
    const dispatch = useDispatch();

    const [state, setState] = useState(InitialState)

    const theme = useTheme();

    const handleChange = (event) => {
        let { name, value } = event?.target;
        setState({ ...state, [name]: value });
    }

    const handleSubmit = () => {

        changePassword
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

        let model = {
            userID: user.id,
            password: state.password,
            oldPassword: state.oldPassword,
        }
        AxiosService.changePassword(model).then((res) => {
            let { data, message } = res?.data;
            
            if (message === "Password doesn't match") {
                setError({ ...error, password: message })
            }
            else {
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
            }

        })
    }


    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Alert severity="warning" variant="outlined" sx={{ borderColor: 'warning.dark' }}>
                    <AlertTitle>Alert!</AlertTitle>
                    Your Password will expire in every 3 months. So change it periodically.
                    <strong> Do not share your password</strong>
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <SubCard title="Change Password">
                    <form noValidate autoComplete="off">
                        <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
                            <Grid item xs={12} md={6}>
                                <TextField error={!!error.oldPassword} onChange={handleChange} helperText={error.oldPassword} type="password" id="outlined-basic7" value={state.oldPassword} name="oldPassword" fullWidth label="Current Password" />
                            </Grid>
                        </Grid>
                        <Grid container spacing={gridSpacing} sx={{ mb: 1.75 }}>
                            <Grid item xs={12} md={6}>
                                <TextField error={!!error.password} onChange={handleChange} helperText={error.password} type="password" id="outlined-basic8" value={state.password} name="password" fullWidth label="New Password" />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField error={!!error.RePassword} onChange={handleChange} helperText={error.RePassword} type="password" id="outlined-basic9" value={state.RePassword} name="RePassword" fullWidth label="Confirm Password" />
                            </Grid>
                        </Grid>
                    </form>
                    <Grid spacing={2} container justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Grid item>
                            <AnimateButton>
                                <Button onClick={handleSubmit} variant="contained">Change Password</Button>
                            </AnimateButton>
                        </Grid>
                        <Grid item>
                            <Button sx={{ color: theme.palette.error.main }} onClick={()=>setState(InitialState)}>Clear</Button>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default ChangePassword;
