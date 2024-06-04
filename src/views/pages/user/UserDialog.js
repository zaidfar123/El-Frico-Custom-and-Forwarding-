import React, { useState, useEffect } from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button, TextField, MenuItem } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import AxiosService from "service";
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import NumberFormat from 'react-number-format';
import { userInsert } from "validation"
import CustomDialog from "ui-component/CustomDialog";
import MuilpleAddress from "ui-component/MuilpleAddress";
import MultiplePhone from "ui-component/MultiplePhone";

let isError = false;

export default function UserDialog({ open, handleClose, item, getList }) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const [error, setError] = useState({})
    const [roleList, setRoleList] = useState([])
    const [addressList, setAddressList] = useState([])
    const [phoneList, setPhoneList] = useState([])
    const [state, setState] = useState({
        userName: "",
        email: "",
        mobileno: "",
        city: "",
        roleID: 0,
        address: "",
        state: "",
        postalCode: ""
    })
    const [isSubmitting, setisSubmitting] = useState(false)

    const validateEmail = (email) => {
        // Regular expression for email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const updateErrors = () => {
        const updatedEmails = addressList.map(({ address, error }) => ({
            address,
            error: validateEmail(address) ? null : "email is not valid",
        }));
        const emailsWithErrors = updatedEmails.filter(({ error }) => error);
        isError = emailsWithErrors.length === 0 ? false : true;
        setAddressList(updatedEmails);
    };


    const onhandleSubmit = () => {

        updateErrors();
        let optionalMobileModels = [];
        let optionalEmailModels = [];

        if (!isError) {

            setisSubmitting(true)

            phoneList.map((item) => {
                optionalMobileModels.push({
                    optionalMobileNo: item.phone
                })
            })

            addressList.map((item) => {
                optionalEmailModels.push({
                    optionalEmail: item.address
                })
            })

            if (item) {

                AxiosService.updateUser({ ...state, optionalMobileModels, optionalEmailModels }).then((res) => {
                    let { data, message } = res?.data;

                    setisSubmitting(false)

                    dispatch(
                        openSnackbar({
                            open: true,
                            message: message,
                            variant: 'alert',
                            alert: {
                                color: message === "User updated successfully." ? 'success' : "error"
                            },
                            close: true
                        })
                    );

                    if (message === "User updated successfully.") {
                        getList();
                        handleClose()
                    }

                })

            }

            else {
                AxiosService.insertUser({ ...state, optionalMobileModels, optionalEmailModels }).then((res) => {
                    let { data, message } = res?.data;

                    setisSubmitting(false)

                    dispatch(
                        openSnackbar({
                            open: true,
                            message: message,
                            variant: 'alert',
                            alert: {
                                color: message === "User Inserted Successfully." ? 'success' : "error"
                            },
                            close: true
                        })
                    );

                    if (message === "User Inserted Successfully.") {
                        getList();
                        handleClose()
                    }

                })
            }
        }
    }

    const getRoles = () => {

        AxiosService.getRoles().then((res) => {
            let { data, message } = res?.data;
            if (data) {
                setRoleList(data);
            }
        })
    }

    const handleSubmit = () => {

        userInsert
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

        getRoles();

        if (item) {
            debugger
            setState({ ...item, mobileno: item.mobileNo, roleID: item.role_ID, userName: item.userDetailName })

            let AddressModal = item.optionalEmailModels;
            let AddressList = [];
            if (AddressModal.length > 0) {
                AddressModal.map((address) => {
                    AddressList.push({
                        address: address.optionalEmail,
                        error: null
                    })
                })
            }

            let PhoneModal = item.optionalMobileModels;
            let PhoneList = [];
            if (PhoneModal.length > 0) {
                PhoneModal.map((phone) => {
                    PhoneList.push({
                        phone: phone.optionalMobileNo,
                        error: null
                    })
                })
            }

            setPhoneList(PhoneList)
            setAddressList(AddressList)
        }

    }, [item])

    return (

        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={"Add User"}
            fullWidth={true}
            maxWidth={"sm"}
            isAction={true}
            handleSubmit={handleSubmit}
            submitTitle={item ? "Update" : "Add"}
            Icon={item ? "edit" : "add"}
            disabled={isSubmitting}
        >
            <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <TextField helperText={error.userName} error={!!error.userName} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.userName} name="userName" label="User Name" />
                        </Grid>

                        <MuilpleAddress
                            row={1}
                            multiline={false}
                            col={6}
                            list={addressList}
                            setList={setAddressList}
                            field={"email"}
                            handleChange={handleChange}
                            error={error}
                            state={state}
                        />
                        <MultiplePhone
                            row={1}
                            multiline={false}
                            col={6}
                            list={phoneList}
                            setList={setPhoneList}
                            field={"mobileno"}
                            handleChange={handleChange}
                            error={error}
                            state={state}
                        />


                        <Grid item xs={6}>
                            <TextField helperText={error.state} error={!!error.state} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.state} name="state" label="State" />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField helperText={error.city} error={!!error.city} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.city} name="city" label="City" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField helperText={error.address} error={!!error.address} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.address} name="address" label="Address" />
                        </Grid>

                        <Grid item xs={6}>
                            <TextField helperText={error.postalCode} error={!!error.postalCode} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.postalCode} name="postalCode" label="Postal Code" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                value={state.roleID}
                                label="User Role"
                                onChange={handleChange}
                                size="small"
                                name="roleID"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                select
                                error={!!error.roleID}
                                helperText={error.roleID}
                            >
                                {roleList.length > 0 && roleList.map((item, index) => (
                                    <MenuItem key={index} value={item.role_ID}>
                                        {item.roleName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </CustomDialog>

    );
}