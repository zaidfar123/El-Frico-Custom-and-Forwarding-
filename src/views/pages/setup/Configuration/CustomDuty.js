import React, { useState, useEffect } from 'react';

// material-ui
import { Button, Grid, TextField, Divider } from '@mui/material';
import AxiosServices from "service";
import { customBreakup } from "validation"
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useTheme, styled } from '@mui/material/styles';

// project imports
import useAuth from 'hooks/useAuth';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import utilsJS from "utilsJS";

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
    '.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall':{
        padding : "5px 15px"
    }
}));
// ==============================|| PROFILE 1 - PROFILE ACCOUNT ||============================== //
const InitialState = {
    customDutyID: 0,
    insurancePercentage: 0,
    landingChargesPercentage: 0,
    customDutyPercentage: 0,
    regultoryDutyPercentage: 0,
    salesTaxPercentage: 0,
    advanceITaxPercentage: 0,
    sdChargesRs: 0,
    excisePercentage: 0,
    taxationCharges: 0
}

const InitialCalculateState = {
    cfValue: 0,
    insurance: 0,
    landing: 0,
    importValue: 0,
    customDuty: 0,
    regultoryDuty: 0,
    salesTax: 0,
    subTotal: 0,
    advanceITax: 0,
    totalPayable: 0,
    excise_taxationCharges: 0,
    conversionRate : 0
}
const CustomDuty = ({isDisabled = false, clearingID = 0, totalAmount = 0 }) => {

    const [state, setState] = useState(InitialState);
    const [calculate, setCalculate] = useState(InitialCalculateState);
    const [error, setError] = useState({});
    const dispatch = useDispatch();

    const handleChangeNumber = (event) => {
        let { name, value } = event.target;
        const isValidInput = /^[+-]?\d+(\.\d*)?$/.test(value);
        if (isValidInput || value === '') {
            setState({ ...state, [name]: value });
            setError({ ...error, [name]: null });
        }
    }

    const getCustomDuty = () => {

        AxiosServices.getCustomDuty({ clearingID }).then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setState(data)
            }

        })
    }

    useEffect(() => {
        getCustomDuty();
    }, [clearingID])


    const calucateFormula = () => {

       
        let cfValue = parseFloat(totalAmount) * parseFloat(state.conversionRate);
        let insurance = (cfValue * (state.insurancePercentage/100));
        let landing = ((cfValue + insurance) * (state.landingChargesPercentage/100));
        let importValue = cfValue + insurance + landing + 1;
        let customDuty = importValue * (state.customDutyPercentage/100);
        let regultoryDuty = importValue * (state.regultoryDutyPercentage/100);
        let salesTax = ((importValue + customDuty + regultoryDuty) * (state.salesTaxPercentage/100));
        let subTotal = salesTax + customDuty + regultoryDuty;
        let advanceITax = ((importValue+subTotal) * (state.advanceITaxPercentage/100))
        let totalPayable = subTotal + advanceITax;
        let excise_taxationCharges = ((importValue * (state.excisePercentage/100)) + (parseInt(state.sdChargesRs) + parseInt(state.taxationCharges)));
                
        setCalculate({
            cfValue: cfValue,
            insurance: insurance,
            landing: landing,
            importValue: importValue ,
            customDuty: customDuty,
            regultoryDuty: regultoryDuty,
            salesTax: salesTax,
            subTotal: subTotal,
            advanceITax: advanceITax,
            totalPayable: totalPayable,
            excise_taxationCharges:excise_taxationCharges 
        
        })
    }


    useEffect(() => {
        clearingID !==0 && calucateFormula();
    }, [state])


    const handleSubmit = () => {

        AxiosServices.updateCustomDuty({ ...state, clearingID }).then((res) => {
            let { message } = res?.data;

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
        })
    }

    const onSubmit = () => {

        customBreakup
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
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
                <SubCard title="Break up of Custom Duty">
                    <Grid container spacing={2}>
                        <Grid item xs={clearingID !== 0 ? 8 : 12}>
                            <Grid container spacing={2}>
                                {clearingID !== 0 &&
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.conversionRate} helperText={error.conversionRate} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.conversionRate} name="conversionRate" size="small" label="Conversion Rate" />
                                </Grid>}
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.insurancePercentage} helperText={error.insurancePercentage} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.insurancePercentage} name="insurancePercentage" size="small" label="Insurance (%)" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.landingChargesPercentage} helperText={error.landingChargesPercentage} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.landingChargesPercentage} name="landingChargesPercentage" size="small" label="Landing Charge (%)" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.customDutyPercentage} helperText={error.customDutyPercentage} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.customDutyPercentage} name="customDutyPercentage" size="small" label="Custom Duty (%)" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.regultoryDutyPercentage} helperText={error.regultoryDutyPercentage} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.regultoryDutyPercentage} name="regultoryDutyPercentage" size="small" label="Regulatory Duty" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.salesTaxPercentage} helperText={error.salesTaxPercentage} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.salesTaxPercentage} name="salesTaxPercentage" size="small" label="Sales Tax" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.advanceITaxPercentage} helperText={error.advanceITaxPercentage} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.advanceITaxPercentage} name="advanceITaxPercentage" size="small" label="Advance I.tax" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.sdChargesRs} helperText={error.sdChargesRs} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.sdChargesRs} name="sdChargesRs" size="small" label="Sales & Distribution" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.excisePercentage} helperText={error.excisePercentage} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.excisePercentage} name="excisePercentage" size="small" label="Excise (%)" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                    <TextField fullWidth error={!!error.taxationCharges} helperText={error.taxationCharges} InputLabelProps={{ shrink: true }} onChange={handleChangeNumber} value={state.taxationCharges} name="taxationCharges" size="small" label="Taxation Charges" />
                                </Grid>
                                <Grid item xs={clearingID !== 0 ? 6 : 2.4}>
                                   <Button disabled={clearingID !== 0 && isDisabled } fullWidth variant='contained' style={{ float: "right" }} autoFocus onClick={() => onSubmit()}>
                                        Update
                                    </Button>
                                </Grid>

                            </Grid>
                        </Grid>

                        {/* ---------------Fields Calculation------------------------ */}
                        {clearingID !== 0 && 
                        <Grid item xs={4}>
                            
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.cfValue))} size="small" label="C & F Value" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.insurance))} size="small" label="Insurance" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.landing))} size="small" label="Landing Charge" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.importValue))} size="small" label="Import Value" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.customDuty))} size="small" label="Custom Duty" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.regultoryDuty))} size="small" label="Regulatory Duty" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.salesTax))} size="small" label="Sales Tax" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.subTotal))} size="small" label="Sub Total" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.advanceITax))} size="small" label="Advance I. Taxation" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(Math.round(calculate.totalPayable))} size="small" label="Total Payable" />
                                </Grid>
                                <Grid item xs={6}>
                                    <StyledTextField fullWidth disabled={true} InputLabelProps={{ shrink: true }} value={utilsJS.getFormattedAmount(parseFloat(Math.round(calculate.excise_taxationCharges)))} size="small" label="Excise & Taxation Charges" />
                                </Grid>
                            </Grid>
                        </Grid>
                        }

                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default CustomDuty;
