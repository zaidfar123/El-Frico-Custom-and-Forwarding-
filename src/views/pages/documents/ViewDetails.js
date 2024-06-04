import React, { useState, useEffect } from 'react';
import { Grid, DialogTitle, AppBar, Slide, Toolbar, DialogContent, CardActions, TextField, Dialog, Button, InputAdornment, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ViewImage from "./ViewImage";
import CustomDuty from "../setup/Configuration/CustomDuty"
import "./style.css";
import ClearingAgencyForm from "../setup/Configuration/ClearingAgencyForm";
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';
import AxiosServices from "service";
import utilsJS from "utilsJS";
import dayjs from "dayjs";
import Paper from '@mui/material/Paper';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import ExcelDynamicRows from "./ExcelDynamicRows";
import ExcelStaticRows from "./ExcelStaticRows";
import CustomDutyExcelWrapper from "./CustomDutyExcelWrapper";
import ShipmentDetails from "./ShipmentDetails";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const StyledInputLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
    fontWeight: 500,
    fontSize: "13px"
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
    fontSize: "11px"
}));
const StyledTableHead = styled(TableHead)(({ theme }) => ({
    background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light
}));
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
    // borderRadius: "6px"
}));


var IMAGE = null;

const InitialCustomDuty = {
    customDutyID: 0,
    insurancePercentage: 0,
    landingChargesPercentage: 0,
    customDutyPercentage: 0,
    regultoryDutyPercentage: 0,
    salesTaxPercentage: 0,
    advanceITaxPercentage: 0,
    sdChargesRs: 0,
    excisePercentage: 0,
    taxationCharges: 0,
    conversionRate: 0,
    itp: 0,

    additionalCustomsDutyPercentage: 0,
    additionalSalesTaxPercentage: 0,
    centralExciseDutyPercentage: 0,
    sedPercentage: 0,
    sedPercentage2: 0,
    stampDutyPercentage: 0,
    sedLable1: "",
    sedLable2: "",
    bondingPercentage: 0,

    insuranceValue: 0,
    landingChargesValue: 0,
    customDutyValue: 0,
    additionalCustomsDutyValue: 0,
    regultoryDutyValue: 0,
    salesTaxValue: 0,
    additionalSalesTaxValue: 0,
    centralExciseDutyValue: 0,
    advanceITaxValue: 0,
    sedValue: 0,
    sedValue2: 0,
    bondingValue: 0,
    stampDutyValue: 0,
    generalSalesTaxPercentage: 0,
    generalSalesTaxValue: 0,
    incomeTaxValue: 0,
    incomeTaxPercentage: 0,
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
    conversionRate: 0,
    additionalCustomsDutyPercentage: 0,
    additionalSalesTaxPercentage: 0,
    centralExciseDutyPercentage: 0,
    sedPercentage: 0,
    sedPercentage2: 0,
    stampDutyPercentage: 0,
    sedLable1: "",
    sedLable2: "",
    bondingPercentage: 0,
    stampDuty: 0,
}

export default function ViewDetails({ open, handleClose, item, onApproval, isLoading, }) {

    const theme = useTheme();
    const [openImage, setOpenImage] = useState(false);
    const [customDutyState, setCustomDuty] = useState(InitialCustomDuty);
    const [calculate, setCalculate] = useState({});
    const [agaencyList, setAgencyList] = useState([]);
    const [isCustomLoading, setIsCustomLoading] = useState(false);
    const { user } = useAuth();
    const dispatch = useDispatch();

    const handleChangeNumber = (event) => {
        let { name, value } = event.target;
        const isValidInput = /^[+-]?\d+(\.\d*)?$/.test(value);
        if (isValidInput || value === '') {
            setCustomDuty({ ...customDutyState, [name]: value });
            // setError({ ...error, [name]: null });
        }
    }
    const handleChange = (event) => {
        let { name, value } = event.target;
        setCustomDuty({ ...customDutyState, [name]: value });
    }

    const handleOpen = (img) => {
        IMAGE = img;
        setOpenImage(true)
    }
    const handleCloseImage = () => {
        setOpenImage(false)
    }

    const fontStyle = {
        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
        fontSize : "11px"
    }
    const formulaStyle = { fontSize : "10px", fontStyle: "italic" }

    const backgroundStyle = { background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light, fontWeight: 600 }

    const getCustomDuty = () => {

        setIsCustomLoading(true)

        AxiosServices.getCustomDuty({ clearingID: item.clearingID }).then((res) => {

            let { data, message } = res?.data;
            if (data) {
                console.log("item", data)

                setCustomDuty(data)
                setIsCustomLoading(false)

            }

        })
    }

    useEffect(() => {
        getCustomDuty();
        getClearingAgency()
    }, [open])


    const getClearingAgency = () => {

        let model = {
            pagenumber: 1,
            pageSize: 10,
            clearingID: item.clearingID
        }

        AxiosServices.getClearingAgency(model).then((res) => {

            let { data, message } = res?.data;
            if (data) {

                setAgencyList(data[0].clearingAgencyAmounts)
            }
        })

    }



    const updateAgencyList = () => {
        setAgencyList(prevState => (
            prevState.map(item => {
                if (item.module === "Total Payable" && item.dynamicFlag) {
                    return { ...item, amount: calculate.totalPayable }; // Update amount to taxcharges
                } else if (item.module === "Excsie & Taxation Charges" && item.dynamicFlag) {
                    return { ...item, amount: calculate.excise_taxationCharges }; // Update amount to sdcharges
                }
                else if (item.module === "Total General Sales Tax" && item.dynamicFlag) {

                    return { ...item, amount: calculate.totalGeneralSales }; // Update amount to sdcharges
                }
                return item; // Return unchanged item if module doesn't match
            })
        ));
    };

    useEffect(() => {
        calucateFormula();
    }, [customDutyState, open])

    useEffect(() => {
        if (agaencyList.length > 0) {
            updateAgencyList();
        }
    }, [calculate])

    const calucateFormula = () => {

        let cfValue = parseFloat(customDutyState?.itp || 0) * parseFloat(customDutyState?.conversionRate || 0);
        let insurance = (cfValue * ((customDutyState?.insurancePercentage || 0) / 100)) + parseFloat(customDutyState?.insuranceValue || 0);
        let landing = ((cfValue + insurance) * ((customDutyState?.landingChargesPercentage || 0) / 100)) + parseFloat(customDutyState?.landingChargesValue || 0);
        let importValue = cfValue + insurance + landing + 1;
        let customDuty = importValue * ((customDutyState?.customDutyPercentage || 0) / 100) + parseFloat(customDutyState?.customDutyValue || 0);
        let additionalCustomsDutyPercentage = importValue * ((customDutyState?.additionalCustomsDutyPercentage || 0) / 100) + parseFloat(customDutyState?.additionalCustomsDutyValue || 0);
        let regultoryDuty = importValue * ((customDutyState?.regultoryDutyPercentage || 0) / 100) + parseFloat(customDutyState?.regultoryDutyValue || 0);
        let totalDuties = (regultoryDuty + additionalCustomsDutyPercentage + customDuty);
        let salesTax = ((importValue + totalDuties) * ((customDutyState?.salesTaxPercentage || 0) / 100)) + parseFloat(customDutyState?.salesTaxValue || 0);
        let additionalSalesTaxPercentage = ((importValue + totalDuties) * ((customDutyState?.additionalSalesTaxPercentage || 0) / 100)) + parseFloat(customDutyState?.additionalSalesTaxValue || 0);
        let centralExciseDutyPercentage = ((importValue + totalDuties) * ((customDutyState?.centralExciseDutyPercentage || 0) / 100)) + parseFloat(customDutyState?.centralExciseDutyValue || 0);
        let totalTaxes = (salesTax + additionalSalesTaxPercentage + centralExciseDutyPercentage);
        let subTotal = salesTax + customDuty + regultoryDuty;
        let advanceITax = ((importValue + subTotal) * ((customDutyState?.advanceITaxPercentage || 0) / 100)) + parseFloat(customDutyState?.advanceITaxValue || 0);
        let totalPayable = totalDuties + totalTaxes + advanceITax;
        let sedPercentage = (importValue * ((customDutyState?.sedPercentage || 0) / 100)) + parseFloat(customDutyState?.sedValue || 0);
        let sedPercentage2 = (importValue * ((customDutyState?.sedPercentage2 || 0) / 100)) + parseFloat(customDutyState?.sedValue2 || 0);
        let totalSED = sedPercentage + totalPayable;
        let bondingPercentage = (importValue * ((customDutyState?.bondingPercentage || 0) / 100)) + parseFloat(customDutyState?.bondingValue || 0);
        let stampDutyValue = parseFloat(customDutyState?.stampDutyValue || 0);
        let excise_taxationCharges = ((importValue * ((customDutyState?.excisePercentage || 0) / 100)) + (parseInt(customDutyState?.sdChargesRs || 0) + parseInt(customDutyState?.taxationCharges || 0)));
        let generalSalesTaxPercentage = (((importValue + totalDuties + advanceITax) * 1.3) * ((customDutyState?.generalSalesTaxPercentage || 0) / 100)) + (parseInt(customDutyState?.generalSalesTaxValue || 0) - salesTax);
        let incomeTaxPercentage = (((generalSalesTaxPercentage) * ((customDutyState?.incomeTaxPercentage || 0) / 100)) + parseInt(customDutyState?.incomeTaxValue || 0));
        let totalGeneralSales = generalSalesTaxPercentage + incomeTaxPercentage;

        setCalculate({
            cfValue: cfValue,
            insurance: insurance,
            landing: landing,
            importValue: importValue,
            customDuty: customDuty,
            additionalCustomsDutyPercentage: additionalCustomsDutyPercentage,
            additionalSalesTaxPercentage: additionalSalesTaxPercentage,
            centralExciseDutyPercentage: centralExciseDutyPercentage,
            sedPercentage: sedPercentage,
            sedPercentage2: sedPercentage2,
            totalSED: totalSED,
            totalTaxes: totalTaxes,
            regultoryDuty: regultoryDuty,
            totalDuties: totalDuties,
            salesTax: salesTax,
            subTotal: subTotal,
            advanceITax: advanceITax,
            totalPayable: totalPayable,
            excise_taxationCharges: excise_taxationCharges,
            bondingPercentage: bondingPercentage,
            stampDutyValue: stampDutyValue,
            generalSalesTaxPercentage: generalSalesTaxPercentage,
            incomeTaxPercentage: incomeTaxPercentage,
            totalGeneralSales: totalGeneralSales,

        })
    }

    const onSubmit = () => {

        let model = {
            customDutyID: customDutyState?.customDutyID || 0,
            insurancePercentage: customDutyState?.insurancePercentage || 0,
            landingChargesPercentage: customDutyState?.landingChargesPercentage || 0,
            customDutyPercentage: customDutyState?.customDutyPercentage || 0,
            additionalCustomsDutyPercentage: customDutyState?.additionalCustomsDutyPercentage || 0,
            additionalSalesTaxPercentage: customDutyState?.additionalSalesTaxPercentage || 0,
            centralExciseDutyPercentage: customDutyState?.centralExciseDutyPercentage || 0,
            sedPercentage: customDutyState?.sedPercentage || 0,
            sedPercentage2: customDutyState?.sedPercentage2 || 0,
            sedLable1: customDutyState?.sedLable1 || "",
            sedLable2: customDutyState?.sedLable2 || "",
            sedValue: customDutyState?.sedValue || 0,
            sedValue2: customDutyState?.sedValue2 || 0,
            regultoryDutyPercentage: customDutyState?.regultoryDutyPercentage || 0,
            salesTaxPercentage: customDutyState?.salesTaxPercentage || 0,
            advanceITaxPercentage: customDutyState?.advanceITaxPercentage || 0,
            sdChargesRs: customDutyState?.sdChargesRs || 0,
            excisePercentage: customDutyState?.excisePercentage || 0,
            taxationCharges: customDutyState?.taxationCharges || 0,
            conversionRate: customDutyState?.conversionRate || 0,
            itp: customDutyState?.itp || 0,
            insuranceValue: customDutyState?.insuranceValue || 0,
            bondingPercentage: customDutyState?.bondingPercentage || 0,
            stampDutyValue: customDutyState?.stampDutyValue || 0,
            stampDutyPercentage: customDutyState?.stampDutyPercentage || 0,
            generalSalesTaxPercentage: customDutyState?.generalSalesTaxPercentage || 0,
            incomeTaxPercentage: customDutyState?.incomeTaxPercentage || 0,
            incomeTaxValue: customDutyState?.incomeTaxValue || 0,
            landingChargesValue: customDutyState?.landingChargesValue || 0,
            customDutyValue: customDutyState?.customDutyValue || 0,
            additionalCustomsDutyValue: customDutyState?.additionalCustomsDutyValue || 0,
            regultoryDutyValue: customDutyState?.regultoryDutyValue || 0,
            salesTaxValue: customDutyState?.salesTaxValue || 0,
            additionalSalesTaxValue: customDutyState?.additionalSalesTaxValue || 0,
            centralExciseDutyValue: customDutyState?.centralExciseDutyValue || 0,
            advanceITaxValue: customDutyState?.advanceITaxValue || 0,
            bondingValue: customDutyState?.bondingValue || 0,
            generalSalesTaxValue: customDutyState?.generalSalesTaxValue || 0,
        }

        AxiosServices.updateCustomDuty({ ...model, clearingID: item.clearingID }).then((res) => {
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

    const ExtractedData = [
        {
            title: "File No",
            value: item.fileNo
        },
        {
            title: "Consignee Name",
            value: item.consignee
        },
        {
            title: "Bill of Lading",
            value: item.billOfLading
        },
        {
            title: "Vessel",
            value: item.vessel
        },
        {
            title: "Wharf Name",
            value: item.wharfName
        },
        {
            title: "Shed No",
            value: item.shedNo
        },
        {
            title: "Voyyage No",
            value: item.voyNo
        },
        {
            title: "Port of Loading",
            value: item.portofLoading
        },
        {
            title: "Port of Discharge",
            value: item.portofDischarge
        },
        {
            title: "Shipper Name",
            value: item.shipperName
        },
        {
            title: "Freight Forwarder Shipping Line",
            value: item.freightForwarderShippingLine
        },
        {
            title: "Freight Terms",
            value: item.freightTerms
        },
        {
            title: "Shipping Terms",
            value: item.shippingTerms
        },
        {
            title: "Invoice No",
            value: item.invoiceNo
        },
        {
            title: "Total Amount",
            value: item.totalAmount
        },
        {
            title: "LC No",
            value: item.lC_Number
        },
        {
            title: "Currency Conversion Unit",
            value: item.conversionUnitName
        }
    ];

    const RowsData = [
        {
            title: "C & F VALUE",
            formula : "Value Assessed by Customs x Conversion Rate",
            result: calculate.cfValue,
        },
        {
            title: "Insurance",
            formula : "C & F VALUE x (%) and + Value Field",
            percentValue: customDutyState.insurancePercentage,
            percentName: "insurancePercentage",
            Value: customDutyState.insuranceValue,
            valueName: "insuranceValue",
            result: calculate.insurance,
        },
        {
            title: "Landing Charges",
            formula : "C & F VALUE x (%) and + Value Field",
            percentValue: customDutyState.landingChargesPercentage,
            percentName: "landingChargesPercentage",
            Value: customDutyState.landingChargesValue,
            valueName: "landingChargesValue",
            result: calculate.landing,
        },
        {
            title: "Import Value",
            formula : "C & F VALUE + Insurance + Landing Charges",
            result: calculate.importValue,
        },
        {
            title: "Custom Duty",
            formula : "Import Value x (%) + Value Field",
            percentValue: customDutyState.customDutyPercentage,
            percentName: "customDutyPercentage",
            Value: customDutyState.customDutyValue,
            valueName: "customDutyValue",
            result: calculate.customDuty,
        },
        {
            title: "Additional Custom Duty",
            formula : "Import Value x (%) + Value Field",
            percentValue: customDutyState.additionalCustomsDutyPercentage,
            percentName: "additionalCustomsDutyPercentage",
            Value: customDutyState.additionalCustomsDutyValue,
            valueName: "additionalCustomsDutyValue",
            result: calculate.additionalCustomsDutyPercentage,
        },

        {
            title: "Regulatory Duty",
            formula : "Import Value x (%) + Value Field",
            percentValue: customDutyState.regultoryDutyPercentage,
            percentName: "regultoryDutyPercentage",
            Value: customDutyState.regultoryDutyValue,
            valueName: "regultoryDutyValue",
            result: calculate.regultoryDuty,
        },
        {
            title: "Total Duties",
            formula : "Custom Duty + Additional Customs Duty + Regulatory Duty",
            result: calculate.totalDuties,
        },
        {
            title: "Sales Tax",
            formula : "Import Value + Total Duties x (%) + Value Field",
            percentValue: customDutyState.salesTaxPercentage,
            percentName: "salesTaxPercentage",
            Value: customDutyState.salesTaxValue,
            valueName: "salesTaxValue",
            result: calculate.salesTax,
        },
        {
            title: "Additional Sales Tax",
            formula : "Import Value + Total Duties x (%) + Value Field",
            percentValue: customDutyState.additionalSalesTaxPercentage,
            percentName: "additionalSalesTaxPercentage",
            Value: customDutyState.additionalSalesTaxValue,
            valueName: "additionalSalesTaxValue",
            result: calculate.additionalSalesTaxPercentage,
        },
        {
            title: "Central Excise Duty",
            formula : "Import Value + Total Duties x (%) + Value Field",
            percentValue: customDutyState.centralExciseDutyPercentage,
            percentName: "centralExciseDutyPercentage",
            Value: customDutyState.centralExciseDutyValue,
            valueName: "centralExciseDutyValue",
            result: calculate.centralExciseDutyPercentage,
        },
        {
            title: "Total Taxes",
            formula : "Sales Tax + Additional Sales Tax + Central Excise Duty",
            result: calculate.totalTaxes,
        },
        {
            title: "Advance I.Tax",
            formula : "Import Value + Total Duties + Total Taxes x (%) + Value Field",
            percentValue: customDutyState.advanceITaxPercentage,
            percentName: "advanceITaxPercentage",
            Value: customDutyState.advanceITaxValue,
            valueName: "advanceITaxValue",
            result: calculate.advanceITax,
        },
        {
            title: "TOTAL PAYABLE",
            formula : "Total Duties + Total Taxes + Advance I.Tax",
            result: calculate.totalPayable,
        },
        {
            title: "",
            formula : "Import Value x (%) + Value Field",
            percentValue: customDutyState.sedPercentage,
            percentName: "sedPercentage",
            Value: customDutyState.sedValue,
            valueName: "sedValue",
            labelValue: customDutyState.sedLable1,
            labelName: "sedLable1",
            result: calculate.sedPercentage,
        },
        {
            title: "",
            formula : "Import Value x (%) + Value Field",
            percentValue: customDutyState.sedPercentage2,
            percentName: "sedPercentage2",
            Value: customDutyState.sedValue2,
            valueName: "sedValue2",
            labelValue: customDutyState.sedLable2,
            labelName: "sedLable2",
            result: calculate.sedPercentage2,
        },
        {
            title: "Total Payable after S.E.D",
            formula : `${customDutyState.sedLable1 || "Field 15"} + ${customDutyState.sedLable2 || "Field 16"}`,
            result: calculate.totalSED,
        },
        {
            title: "1% Bonding Charges",
            formula : "Import Value x (%) + Value Field",
            percentValue: customDutyState.bondingPercentage,
            percentName: "bondingPercentage",
            Value: customDutyState.bondingValue,
            valueName: "bondingValue",
            result: calculate.bondingPercentage,
        },
        {
            title: "Excise & Taxation Charges",
            formula : "Import Value x (%) + Value Field",
            percentValue: customDutyState.excisePercentage,
            percentName: "excisePercentage",
            Value: customDutyState.taxationCharges,
            valueName: "taxationCharges",
            result: calculate.excise_taxationCharges,
            sdValue :calculate.sdChargesRs ,
            sdName : "sdChargesRs"
        },
        {
            title: "Stamp Duty",
            formula : "(%) + Value Field",
            percentValue: customDutyState.excisePercentage,
            percentName: "excisePercentage",
            Value: customDutyState.stampDutyValue,
            valueName: "stampDutyValue",
            result: calculate.stampDutyValue,
        },
        {
            title: "General Sales Tax",
            formula : "Import Value + Total Duties + Total Taxes + Advance Income Tax x (%) + Value Field",
            percentValue: customDutyState.generalSalesTaxPercentage,
            percentName: "generalSalesTaxPercentage",
            Value: customDutyState.generalSalesTaxValue,
            valueName: "generalSalesTaxValue",
            result: calculate.generalSalesTaxPercentage,
        },
        {
            title: "Income Tax on General Sales Tax",
            formula : "General Sales Tax x (%) + Value Field",
            percentValue: customDutyState.incomeTaxPercentage,
            percentName: "incomeTaxPercentage",
            Value: customDutyState.incomeTaxValue,
            valueName: "incomeTaxValue",
            result: calculate.incomeTaxPercentage,
        },
        {
            title: "Total General Sales Tax with Income tax",
            formula : "General Sales Tax + Income Tax on General Sales Tax",
            result: calculate.totalGeneralSales,
        },

    ];

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
                TransitionComponent={Transition}
            >
                <AppBar position="sticky">
                    <Toolbar style={{ justifyContent: "space-between", background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, padding: "8px" }}>
                        <Typography variant="h4">
                            Clearing Details
                        </Typography>

                        <div className="clearing-approval-buttons">
                            {ApprovalButtons.isAuthentic(user.role) &&
                                <>
                                    <ApprovalButtons.RejectButton class="reject" Id={[item.clearingID]} isLoading={isLoading} rejected={true} approved={false} onApproval={onApproval} disabled={!ApprovalButtons.isEnabled(item.rfpStatus)} />
                                    <ApprovalButtons.ApproveButton class="approve" Id={[item.clearingID]} isLoading={isLoading} rejected={false} approved={true} onApproval={onApproval} disabled={!ApprovalButtons.isEnabled(item.rfpStatus)} />
                                </>
                            }
                            <Button onClick={handleClose} variant="contained" size="small">Close</Button>
                        </div>
                    </Toolbar>
                </AppBar>
                <DialogContent style={{ padding: "4px" }}>

                    <SubCard style={{ marginBottom: "6px", marginTop: "6px" }} title="Shipment Details" content={false}>
                        <ShipmentDetails item={item} />
                    </SubCard>
                    
                    <SubCard style={{ marginBottom: "6px", padding: "4px" }} title="Data Extracted">
                        <Grid container spacing={2} sx={{ my: 0, mt: 0 }}>
                            {ExtractedData.map((data) => {
                                return (
                                    <Grid item xs={2}>
                                        <StyledInputLabel variant="h6">{data.title}</StyledInputLabel>
                                        <StyledTypography variant="subtitle1">{data.value || "-"}</StyledTypography>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </SubCard>

                    <SubCard style={{ marginBottom: "6px", padding: 0 }} content={false}>
                        <TableContainer component={Paper} className="clearing-table">
                            <Table size="small" >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left" colSpan={12}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">REFERENCE NO:</Typography>
                                                <Typography variant="h6" style={fontStyle}>{item.fileNo}</Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" colSpan={12} style={backgroundStyle}>
                                            <Typography variant="h6" style={fontStyle}>EL FRICO Clearing & Forwarding Agent</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" colSpan={12}>
                                            <Typography variant="h6" style={fontStyle}>REQUEST FOR PAYORDER</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" colSpan={12} >
                                            <Typography variant="h6" style={fontStyle}>{item.shippingResponses[0].shipmentTypeDetailName}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="left" colSpan={10}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">Date:</Typography>
                                                <Typography variant="h6">{dayjs(item.creationDate).format("DD-MM-YYYY")}</Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" colSpan={2}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">B/L #: </Typography>
                                                <Typography variant="h6">{item.billOfLading || "-"}</Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="center" colSpan={10}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">IMPORTER:</Typography>
                                                <Typography variant="h6">{item.consignee || "-"}</Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" colSpan={2}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">Arrival: </Typography>
                                                <Typography variant="h6">{"-"}</Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" colSpan={10}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">L/C NO:</Typography>
                                                <Typography variant="h6" style={fontStyle}>{item.lC_Number || "-"}</Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" colSpan={2}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">Value as per Invoice: </Typography>
                                                <Typography variant="h6" style={fontStyle}>{item.conversionUnitName + " " + utilsJS.getFormattedAmount(item.totalAmount)}</Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="center" colSpan={10}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">Vessel</Typography>
                                                <Typography variant="h6" style={fontStyle}>{item.vessel || "-"}</Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" colSpan={2}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">Value Ass. By Custom (ITP):</Typography>
                                                <Typography variant="h6" style={fontStyle}>

                                                    {/* {utilsJS.getCurrency(item.conversionUnitName) + utilsJS.getFormattedAmount(customDutyState.itp)} */}

                                                    <TextField
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">
                                                                <Typography variant="h6" style={fontStyle}>{item.conversionUnitName}</Typography>
                                                            </InputAdornment>,
                                                        }}
                                                        style={{ width: '110px' }}
                                                        value={customDutyState.itp}
                                                        variant="standard"
                                                        size="small"
                                                        onChange={handleChangeNumber}
                                                        name={"itp"}
                                                    />
                                                </Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="center" colSpan={10} style={backgroundStyle}>
                                            <div className="table-splitter">
                                                <Typography variant="h6">Product (s)</Typography>
                                                <Typography variant="h6"></Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell align="left" colSpan={2}>
                                            <div className="table-splitter">
                                                {/* <Typography variant="h6">Conversion Rate:</Typography> */}
                                                <Typography variant="h6" style={fontStyle}>
                                                    <TextField
                                                        InputProps={{
                                                            startAdornment: <InputAdornment position="start">
                                                                <Typography variant="h6">Conversion Rate (Rs.)</Typography>
                                                            </InputAdornment>,
                                                        }}
                                                        value={customDutyState.conversionRate}
                                                        variant="standard"
                                                        size="small"
                                                        onChange={handleChangeNumber}
                                                        name={"conversionRate"}
                                                    />
                                                </Typography>
                                            </div>
                                        </TableCell>
                                    </TableRow>

                                    {item.listItem.length > 0 && item.listItem.map((row, index) => (
                                        <>
                                            <TableRow hover key={index}>
                                                <TableCell align="center" colSpan={6}>
                                                    <div className="table-splitter">
                                                        <Typography variant="h6">ITEM #: {index + 1}</Typography>
                                                        <Typography variant="h6" style={fontStyle}>{row.item}</Typography>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" colSpan={2}>
                                                    <div className="table-splitter">
                                                        <Typography variant="h6">PKGS:</Typography>
                                                        <Typography variant="h6" style={fontStyle}>{row.noOfPkgs}</Typography>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="left" colSpan={2}>
                                                    <div className="table-splitter">
                                                        <Typography variant="h6">H.S No(S):</Typography>
                                                        <Typography variant="h6" style={fontStyle}>{row.harmonizedSystemCode}</Typography>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="left" colSpan={2}>
                                                    <div className="table-splitter">
                                                        <Typography variant="h6">NET WT:</Typography>
                                                        <Typography variant="h6" style={fontStyle}>{row.netWeight}</Typography>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))}


                                    {/* -------------------Divider---------------- */}
                                    <TableRow>
                                        <TableCell align="center" colSpan={12}>
                                        </TableCell>
                                    </TableRow>


                                    {agaencyList.length > 0 && agaencyList.map((row, index) => (
                                        <>
                                            <TableRow hover key={index}>

                                                <TableCell align="left" colSpan={10}>
                                                    <div className="table-splitter">
                                                        <Typography variant="h6">{index + 1}</Typography>
                                                        <Typography variant="h6" style={fontStyle}>{row.agencyName}</Typography>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right" colSpan={2}>
                                                    <div className="table-splitter">
                                                        <Typography variant="h6">Rs: </Typography>
                                                        <Typography variant="h6" style={fontStyle}>{utilsJS.getFormattedAmount(Math.round(row.amount))}</Typography>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))}

                                    {/* -------------------BREAK UP OF CUSTOM DUTY---------------- */}

                                    <CustomDutyExcelWrapper onSubmit={onSubmit} disabled={!ApprovalButtons.isEnabled(item.rfpStatus)}>

                                        <ExcelStaticRows Index={0} itemObject={RowsData} />
                                        <ExcelDynamicRows Index={1} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelDynamicRows Index={2} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelStaticRows Index={3} itemObject={RowsData} />
                                        <ExcelDynamicRows Index={4} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelDynamicRows Index={5} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelDynamicRows Index={6} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelStaticRows Index={7} itemObject={RowsData} />
                                        <ExcelDynamicRows Index={8} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelDynamicRows Index={9} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelDynamicRows Index={10} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelStaticRows Index={11} itemObject={RowsData} />
                                        <ExcelDynamicRows Index={12} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelStaticRows Index={13} itemObject={RowsData} />
                                        <ExcelDynamicRows Index={14} itemObject={RowsData} onChange={handleChangeNumber} hasLabel={true} onLabelChange={handleChange} />
                                        <ExcelDynamicRows Index={15} itemObject={RowsData} onChange={handleChangeNumber} hasLabel={true} onLabelChange={handleChange} />
                                        <ExcelStaticRows Index={16} itemObject={RowsData} />
                                        <TableRow><TableCell align="center" colSpan={12}></TableCell></TableRow>
                                        <ExcelDynamicRows Index={17} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelDynamicRows Index={18} itemObject={RowsData} onChange={handleChangeNumber} hasSDCharges={true} />
                                        <ExcelDynamicRows Index={19} itemObject={RowsData} onChange={handleChangeNumber} hasSingleText={false} />
                                        <ExcelDynamicRows Index={20} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelDynamicRows Index={21} itemObject={RowsData} onChange={handleChangeNumber} />
                                        <ExcelStaticRows Index={22} itemObject={RowsData} />

                                    </CustomDutyExcelWrapper>

                                </TableHead>
                                <TableBody>

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </SubCard>


                    {ApprovalButtons.isAuthentic(user.role) &&
                        <>
                            <ClearingAgencyForm ntn={item.ntn} customer={item.consignee} getClearingAgency={getClearingAgency} isOpenFromModal clearingID={item.clearingID} isDisabled={!ApprovalButtons.isEnabled(item.rfpStatus)} />
                        </>
                    }

                    <SubCard style={{ marginBottom: "6px" }} title="Documents">
                        <Grid container spacing={0} sx={{ my: 0 }}>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    {item.oCR_RequestModels.length > 0 && item.oCR_RequestModels.map((x, index) => (
                                        <Grid key={index} item xs={12} sm={4} md={4} lg={3}>
                                            <div>
                                                <Card sx={{ maxWidth: 345, borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, border: "1px solid" }}>
                                                    <CardMedia
                                                        component="img"
                                                        height="140"
                                                        image={x.vdPath}
                                                    />
                                                    <CardActions style={{
                                                        padding: "12px",
                                                        justifyContent: "center",
                                                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light
                                                    }}>
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                            <Typography variant="h6">{x.originalName}</Typography>
                                                            <Button onClick={() => handleOpen(x.vdPath)} variant="outlined" startIcon={<RemoveRedEyeIcon />} size="small">View</Button>
                                                        </div>
                                                    </CardActions>
                                                </Card>
                                            </div>
                                        </Grid>
                                    ))
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </SubCard>

                </DialogContent>
                {openImage && <ViewImage open={openImage} handleClose={handleCloseImage} image={IMAGE} />}
            </Dialog>
        </React.Fragment>
    );
}