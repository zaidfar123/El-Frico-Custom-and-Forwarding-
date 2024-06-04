import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Grid, Dialog, AppBar, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, MenuItem, Toolbar, Tooltip, IconButton, } from '@mui/material';
import { shipmentDetails } from "validation";
import SubCard from 'ui-component/cards/SubCard';
import FieldsDialog from "./fieldsDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import AxiosServices from "service";
import dayjs from 'dayjs';
import { openSnackbar } from 'store/slices/snackbar';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme, styled } from '@mui/material/styles';
import { openLoader } from 'store/slices/loadingModal';
import { clearingProduct, clearingAgency, clearingForm } from "validation"
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));
const StyleIconButton = styled(IconButton)(({ theme }) => ({

    background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
    color: `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`

}));

export default function ClearingDrawer(props) {

    let {
        open,
        handleClose,
        state,
        product,
        shedList,
        wharfList,
        productState,
        errorProduct,
        AddProduct,
        handleChange,
        handleChangeNumber,
        handleChangeProduct,
        onSubmit,
        error,
        theme,
        conversionList,
        customTypeList,
        cargoTypeList,
        itemCategoryList,
        teminalList,
        collectorateList,
        shipmentDetailsList,
        cargoTypeDetailList,
        other,
        handleOtherChangeNumber,
        errorShipment,
        handleOtherChange,
        setErrorShipment,
        setList,
        list,
        handleAddShipment,
        bankList,
        removeItemProduct
    } = props;

    const deleteRow = (indexToRemove) => {
        const newData = [...list];
        newData.splice(indexToRemove, 1);
        setList(newData);
    };

    const isListVisible = (Id) => {
        let Obj = cargoTypeList.find(x => x.cargoTypeID === Id);
        if (typeof (Obj) !== 'undefined') {
            return Obj.cargoTypeName === "Container" ? true : false
        }
        return false;
    };

    return (
        <div>
            <Drawer
                anchor={"left"}
                open={open}
                onClose={handleClose}
                variant="temporary"
                className='Custom-Drawer'
            >
                <Box
                    sx={{ width: 650 }}
                    role="presentation"
                >
                    <AppBar component="nav"
                        sx={{
                            width: 650,
                            left: 0,
                            justifyContent: "space-between",
                            background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
                        }}
                    >
                        <Toolbar
                            sx={{ p: "8px" }}
                        >
                            <Typography
                                variant="h4"
                                component="div"
                                sx={{
                                    flexGrow: 1,
                                    display: { xs: 'none', sm: 'block' },
                                    color: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
                                }}
                            >
                                Clearing Form
                            </Typography>
                            <Tooltip title="Toggle Clearing Form">
                                <StyleIconButton size="small" onClick={handleClose}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-bar-left" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M4 12l10 0" />
                                        <path d="M4 12l4 4" />
                                        <path d="M4 12l4 -4" />
                                        <path d="M20 4l0 16" />
                                    </svg>
                                    {/* <CloseIcon /> */}
                                </StyleIconButton>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={2} >

                        <Grid item xs={12} style={{ height: '100%', overflow: 'auto', width: "100%" }}>
                            {/* <p style={{fontSize: '15px', fontWeight : 500, textAlign: 'center'}}>Clearing Form</p> */}
                            <div style={{ marginTop: "60px" }}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={12}>
                                        <SubCard title="Shipment Details">
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <StyledTextField
                                                        value={other.shipmentTypeID}
                                                        label="Shipment Type"
                                                        onChange={handleOtherChange}
                                                        size="small"
                                                        name="shipmentTypeID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        helperText={errorShipment.shipmentTypeID}
                                                        error={!!errorShipment.shipmentTypeID}
                                                        select
                                                        disabled={list.length > 0}
                                                    >
                                                        {customTypeList.length > 0 && customTypeList.map((item, index) => (
                                                            <MenuItem key={index} value={item.customTypeID}>
                                                                {item.customType}
                                                            </MenuItem>
                                                        ))}
                                                    </StyledTextField>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <StyledTextField
                                                        value={other.shipmentTypeDetailID}
                                                        label="Shipment Type Details"
                                                        onChange={handleOtherChange}
                                                        size="small"
                                                        name="shipmentTypeDetailID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        helperText={errorShipment.shipmentTypeDetailID}
                                                        error={!!errorShipment.shipmentTypeDetailID}
                                                        select
                                                        disabled={other.customTypeID === 0 || list.length > 0}
                                                    >
                                                        {shipmentDetailsList.length > 0 && shipmentDetailsList.map((item, index) => (
                                                            <MenuItem key={index} value={item.shipmentTypeDetailID}>
                                                                {item.shipmentTypeDetailName}
                                                            </MenuItem>
                                                        ))}
                                                    </StyledTextField>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        value={other.cargoTypeID}
                                                        label="Cargo Type"
                                                        onChange={handleOtherChange}
                                                        size="small"
                                                        name="cargoTypeID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        helperText={errorShipment.cargoTypeID}
                                                        error={!!errorShipment.cargoTypeID}
                                                        select
                                                    >
                                                        {cargoTypeList.length > 0 && cargoTypeList.map((item, index) => (
                                                            <MenuItem key={index} value={item.cargoTypeID}>
                                                                {item.cargoTypeName}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        value={other.cargoTypeDetailID}
                                                        label="Cargo Type Details"
                                                        onChange={handleOtherChange}
                                                        size="small"
                                                        name="cargoTypeDetailID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        helperText={errorShipment.cargoTypeDetailID}
                                                        error={!!errorShipment.cargoTypeDetailID}
                                                        select
                                                    >
                                                        {cargoTypeDetailList.length > 0 && cargoTypeDetailList.map((item, index) => (
                                                            <MenuItem key={index} value={item.cargoTypeDetailID}>
                                                                {item.cargoTypeDetailName}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        fullWidth
                                                        helperText={errorShipment.count}
                                                        error={!!errorShipment.count}
                                                        InputLabelProps={{ shrink: true }}
                                                        size="small"
                                                        onChange={handleOtherChangeNumber}
                                                        value={other.count}
                                                        name="count"
                                                        label="Count" />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        value={other.itemCategoryID}
                                                        label="Item Category"
                                                        onChange={handleOtherChange}
                                                        size="small"
                                                        name="itemCategoryID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        helperText={errorShipment.itemCategoryID}
                                                        error={!!errorShipment.itemCategoryID}
                                                        select
                                                    >
                                                        {itemCategoryList.map((item, index) => (
                                                            <MenuItem key={index} value={item.itemCategoryID}>
                                                                {item.itemCategoryName}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        value={other.terminalID}
                                                        label="Terminal"
                                                        onChange={handleOtherChange}
                                                        size="small"
                                                        name="terminalID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        helperText={errorShipment.terminalID}
                                                        error={!!errorShipment.terminalID}
                                                        select
                                                    >
                                                        {teminalList.map((item, index) => (
                                                            <MenuItem key={index} value={item.terminalID}>
                                                                {item.terminalName}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        value={other.collectorateID}
                                                        label="Collectorate"
                                                        onChange={handleOtherChange}
                                                        size="small"
                                                        name="collectorateID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        helperText={errorShipment.collectorateID}
                                                        error={!!errorShipment.collectorateID}
                                                        select
                                                    >
                                                        {collectorateList.map((item, index) => (
                                                            <MenuItem key={index} value={item.collectorateID}>
                                                                {item.collectorateName}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField
                                                        value={other.bankID}
                                                        label="Bank"
                                                        onChange={handleOtherChange}
                                                        size="small"
                                                        name="bankID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        helperText={errorShipment.bankID}
                                                        error={!!errorShipment.bankID}
                                                        select
                                                    >
                                                        {bankList.map((item, index) => (
                                                            <MenuItem key={index} value={item.bankID}>
                                                                {item.bankName}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <StyledTextField fullWidth InputLabelProps={{ shrink: true }} size="small" disabled={true} value={state.fileNo} name="fileNo" label="File No" />
                                                </Grid>
                                                {isListVisible(other.cargoTypeID) && <Grid item xs={12}>
                                                    <Button variant="contained" fullWidth onClick={handleAddShipment}>Add to List</Button>
                                                </Grid>}
                                                {isListVisible(other.cargoTypeID) && <Grid item xs={12}>
                                                    <TableContainer>
                                                        <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                                            <TableHead style={{ background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                                                <TableRow>
                                                                    {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                                                    <TableCell style={{ minWidth: 130 }} align="left">Shipment Type</TableCell>
                                                                    <TableCell style={{ minWidth: 190 }} align="left">Shipment Type Details</TableCell>
                                                                    <TableCell style={{ minWidth: 130 }} align="left">Cargo Type</TableCell>
                                                                    <TableCell style={{ minWidth: 190 }} align="left">Cargo Type Details</TableCell>
                                                                    <TableCell style={{ minWidth: 80 }} align="left">Count</TableCell>
                                                                    <TableCell style={{ minWidth: 130 }} align="left">Item Category</TableCell>
                                                                    <TableCell style={{ minWidth: 100 }} align="left">Terminal</TableCell>
                                                                    <TableCell style={{ minWidth: 100 }} align="left">Collectorate</TableCell>
                                                                    <TableCell style={{ minWidth: 100 }} align="left">File No</TableCell>
                                                                    <TableCell style={{ minWidth: 80 }} align="left">Action</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {list.length > 0 && list.map((row, index) => (
                                                                    <TableRow hover key={row.name}>
                                                                        {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                                        <TableCell align="left">{row.customType}</TableCell>
                                                                        <TableCell align="left">{row.shipmentTypeDetailName}</TableCell>
                                                                        <TableCell align="left">{row.cargoTypeName}</TableCell>
                                                                        <TableCell align="left">{row.cargoTypeDetailName}</TableCell>
                                                                        <TableCell align="left">{row.count}</TableCell>
                                                                        <TableCell align="left">{row.itemCategoryName}</TableCell>
                                                                        <TableCell align="left">{row.terminalName}</TableCell>
                                                                        <TableCell style={{ minWidth: 220 }} align="left">{row.collectorateName}</TableCell>
                                                                        <TableCell align="left">{state.fileNo}</TableCell>
                                                                        <TableCell align="left">
                                                                            <IconButton aria-label="delete" size="small" onClick={() => deleteRow(index)}>
                                                                                <DeleteIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>}
                                            </Grid>
                                        </SubCard>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <SubCard
                                            title={"Data Extracted"}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <StyledTextField fullWidth InputLabelProps={{ shrink: true }} size="small" disabled={true} value={state.customerName} name="customerName" label="Customer Name" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.freightTerm} error={!!error.freightTerm} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.freightTerm} name="freightTerm" label="Freight Term" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.shipperName} error={!!error.shipperName} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.shipperName} name="shipperName" label="Shipper Name" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.consignee} error={!!error.consignee} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.consignee} name="consignee" label="Consignee Name" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.portofLoading} error={!!error.portofLoading} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.portofLoading} name="portofLoading" label="Port of Loading" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.portofDischarge} error={!!error.portofDischarge} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.portofDischarge} name="portofDischarge" label="Port of Discharge" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.shippingTerm} error={!!error.shippingTerm} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.shippingTerm} name="shippingTerm" label="Shipping Term" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.InvoiceNo} error={!!error.InvoiceNo} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.InvoiceNo} name="InvoiceNo" label="Invoice No" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.freightForward} error={!!error.freightForward} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.freightForward} name="freightForward" label="Freight Forwarder" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth helperText={error.billOfLading} error={!!error.billOfLading} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.billOfLading} name="billOfLading" label="Bill of Lading" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <StyledTextField
                                                        value={state.shedID}
                                                        label="Shed No"
                                                        onChange={handleChange}
                                                        size="small"
                                                        name="shedID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        error={!!error.shedID}
                                                        select
                                                        helperText={error.shedID}
                                                    >
                                                        {shedList.length > 0 && shedList.map((item, index) => (
                                                            <MenuItem key={index} value={item.shedID}>
                                                                {item.shedNo}
                                                            </MenuItem>
                                                        ))}
                                                    </StyledTextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <StyledTextField
                                                        value={state.wharfID}
                                                        label="Wharf"
                                                        onChange={handleChange}
                                                        size="small"
                                                        name="wharfID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        select
                                                        error={!!error.wharfID}
                                                        helperText={error.wharfID}
                                                    >
                                                        {wharfList.length > 0 && wharfList.map((item, index) => (
                                                            <MenuItem key={index} value={item.wharfID}>
                                                                {item.wharfName}
                                                            </MenuItem>
                                                        ))}
                                                    </StyledTextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <StyledTextField
                                                        value={state.conversionUnitID}
                                                        label="Currency Conversion"
                                                        onChange={handleChange}
                                                        size="small"
                                                        name="conversionUnitID"
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        select
                                                        error={!!error.conversionUnitID}
                                                        helperText={error.conversionUnitID}
                                                    >
                                                        {conversionList.length > 0 && conversionList.map((item, index) => (
                                                            <MenuItem key={index} value={item.conversionUnitID}>
                                                                {item.conversionUnitName}
                                                            </MenuItem>
                                                        ))}
                                                    </StyledTextField>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth error={!!error.vessel} helperText={error.vessel} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.vessel} name="vessel" label="Vessel" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth error={!!error.voyNo} helperText={error.voyNo} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.voyNo} name="voyNo" label="Voyage No" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth error={!!error.lC_Number} helperText={error.lC_Number} InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={state.lC_Number} name="lC_Number" label="LC No" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField fullWidth error={!!error.totalAmount} helperText={error.totalAmount} InputLabelProps={{ shrink: true }} size="small" onChange={handleChangeNumber} value={state.totalAmount} name="totalAmount" label="Invoice Total Amount" />
                                                </Grid>
                                            </Grid>
                                        </SubCard>
                                    </Grid>

                                    <Grid item xs={12} md={12}>
                                        <SubCard title="Products">
                                            <Grid container spacing={2}>
                                                <Grid item xs={4}>
                                                    <TextField fullWidth helperText={errorProduct.noOfPkgs} error={!!errorProduct.noOfPkgs} InputLabelProps={{ shrink: true }} name="noOfPkgs" onChange={handleChangeProduct} value={productState.noOfPkgs} size="small" label="Quantity" />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField fullWidth helperText={errorProduct.item} error={!!errorProduct.item} InputLabelProps={{ shrink: true }} name="item" onChange={handleChangeProduct} value={productState.item} size="small" label="Product Name" />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField fullWidth helperText={errorProduct.grossWeight} error={!!errorProduct.grossWeight} InputLabelProps={{ shrink: true }} name="grossWeight" onChange={handleChangeProduct} value={productState.grossWeight} size="small" label="Gross Weight" />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField fullWidth helperText={errorProduct.netWeight} error={!!errorProduct.netWeight} InputLabelProps={{ shrink: true }} name="netWeight" onChange={handleChangeProduct} value={productState.netWeight} size="small" label="Net Weight" />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <TextField fullWidth helperText={errorProduct.harmonizedSystemCode} error={!!errorProduct.harmonizedSystemCode} InputLabelProps={{ shrink: true }} name="harmonizedSystemCode" onChange={handleChangeProduct} value={productState.harmonizedSystemCode} size="small" label="Harmonized System Code" />
                                                </Grid>
                                                <Grid item xs={12} style={{ padding: "12px", textAlign: "center" }}>
                                                    <Tooltip title="Add to List">
                                                        <StyleIconButton size="small" onClick={() => AddProduct()}>
                                                            <AddIcon />
                                                        </StyleIconButton>
                                                    </Tooltip>
                                                    {!!error.insertItemModels && <p style={{ color: '#f44336', margin: 0, marginTop: "12px" }}>{error.insertItemModels}</p>}
                                                </Grid>
                                            </Grid>
                                            <TableContainer>
                                                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                                    <TableHead style={{ background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                                        <TableRow>
                                                            {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                                            <TableCell align="left">Quantity</TableCell>
                                                            <TableCell align="left">Product</TableCell>
                                                            <TableCell align="left">Gross Weight</TableCell>
                                                            <TableCell align="left">Net Weight</TableCell>
                                                            <TableCell align="left">HS Code</TableCell>
                                                            <TableCell align="left">Action</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {product.length > 0 && product.map((row, index) => (
                                                            <TableRow hover key={row.name}>
                                                                {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                                                <TableCell align="left">{row.noOfPkgs}</TableCell>
                                                                <TableCell align="left">{row.item}</TableCell>
                                                                <TableCell align="left">{row.grossWeight}</TableCell>
                                                                <TableCell align="left">{row.netWeight}</TableCell>
                                                                <TableCell align="left">{row.harmonizedSystemCode}</TableCell>
                                                                <TableCell align="left">
                                                                    <IconButton aria-label="delete" size="small" onClick={() => removeItemProduct(index)}>
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Grid item xs={12} md={12}>
                                                <Button variant="contained" fullWidth style={{
                                                    background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                                                    marginTop: "12px"
                                                }} onClick={() => onSubmit()}>Submit</Button>
                                            </Grid>
                                        </SubCard>
                                    </Grid>
                                </Grid>
                            </div>
                            {/* <img src={croppedImage} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} /> */}
                        </Grid>
                    </Grid>
                </Box >
            </Drawer >
        </div >
    );
}