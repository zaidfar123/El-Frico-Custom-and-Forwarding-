import React, { useState, useEffect } from 'react';
import { Grid, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import AxiosService from "service";
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import NumberFormat from 'react-number-format';
import { customerInsert } from "validation"
import useAuth from 'hooks/useAuth';
import CustomDialog from "ui-component/CustomDialog";
import MuilpleAddress from "ui-component/MuilpleAddress";
import MultiplePhone from "ui-component/MultiplePhone";

let isError = false;

export default function CustomerDialog({ open, handleClose, item, getList }) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();

    const [error, setError] = useState({})
    const [addressList, setAddressList] = useState([])
    const [phoneList, setPhoneList] = useState([])
    const [isSubmitting, setisSubmitting] = useState(false)
    const [state, setState] = useState({
        customerName: "",
        customerEmail: "",
        customerMobileNo: "",
        customerAddress: "",
        adminUserID: user?.id,
        city: "",
        state: "",
        ntn: ""
    })

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

        setisSubmitting(true);
        updateErrors();
        let optionalMobileModels = [];
        let optionalEmailModels = [];


        if(!isError){
            phoneList.map((item)=>{
                optionalMobileModels.push({
                    optionalMobileNo : item.phone
                })
            })
    
            addressList.map((item)=>{
                optionalEmailModels.push({
                    optionalEmail : item.address
                })
            })
            
            if(item){
                AxiosService.updateCustomer({...state, optionalMobileModels, optionalEmailModels}).then((res) => {
                    let { data, message } = res?.data;
                    setisSubmitting(false);
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: message,
                            variant: 'alert',
                            alert: {
                                color: message === "Customer updated successfully." ? 'success' : "error"
                            },
                            close: true
                        })
                    );
                    if (message === "Customer updated successfully.") {
                        handleClose();
                        getList();
                    }
        
                })
            }
            else{AxiosService.insertCustomer({...state, optionalMobileModels, optionalEmailModels}).then((res) => {
                let { data, message } = res?.data;
                setisSubmitting(false);
                dispatch(
                    openSnackbar({
                        open: true,
                        message: message,
                        variant: 'alert',
                        alert: {
                            color: message === "Customer inserted successfully." ? 'success' : "error"
                        },
                        close: true
                    })
                );
                if (message === "Customer inserted successfully.") {
                    handleClose();
                    getList();
                }
    
            })}
        }
        else{
            setisSubmitting(false);
        }
    }

    const handleSubmit = () => {

        customerInsert
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

    useEffect(() => {

        if (item) {
            debugger
            setState({ ...item})

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

    const handleChange = (event) => {

        let { name, value } = event?.target;
        setState({ ...state, [name]: value })
        setError({ ...error, [name]: null })
    }

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={"Add Customer"}
            fullWidth={true}
            maxWidth={"sm"}
            isAction={true}
            handleSubmit={handleSubmit}
            submitTitle={item ? "Update" : "Add"}
            Icon={item ? "edit" : "add"}
            disabled={isSubmitting}
        >
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <TextField helperText={error.customerName} error={!!error.customerName} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.customerName} name="customerName" label="User Name" />
                </Grid>
                {/* <Grid item xs={6}>
                    <TextField helperText={error.customerEmail} error={!!error.customerEmail} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.customerEmail} name="customerEmail" label="Email" />
                </Grid> */}
                <MuilpleAddress
                    row={1}
                    multiline={false}
                    col={6}
                    list={addressList}
                    setList={setAddressList}
                    field={"customerEmail"}
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
                    field={"customerMobileNo"}
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
                    <TextField helperText={error.customerAddress} error={!!error.customerAddress} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.customerAddress} name="customerAddress" label="Address" />
                </Grid>
                <Grid item xs={6}>
                    <TextField helperText={error.ntn} error={!!error.ntn} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state.ntn} name="ntn" label="NTN" />
                </Grid>
                {/* <MuilpleAddress
                    row={1}
                    multiline={false}
                    col={6}
                    list={addressList}
                    setList={setAddressList}
                    field={"customerAddress"}
                    handleChange={handleChange}
                    error={error}
                    state={state}
                /> */}
            </Grid>
        </CustomDialog>
    );
}