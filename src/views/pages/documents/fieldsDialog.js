import * as React from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button } from '@mui/material';
import "./style.css";

const fieldLabels = [
    // { type: "state", fieldname: "Company Name", name: "companyName" },
    { type: "state", fieldname: "Shipper Name", name: "shipperName" },
    { type: "state", fieldname: "Consignee Name", name: "consignee" },
    // { type: "state", fieldname: "Arrival Date", name: "arrivalDate" },
    { type: "state", fieldname: "Port of Loading", name: "portofLoading" },
    { type: "state", fieldname: "Port of Discharge", name: "portofDischarge" },
    { type: "state", fieldname: "Bill of Lading", name: "billOfLading" },
    // { type: "state", fieldname: "Custom Type", name: "customTypeID" },
    { type: "state", fieldname: "Vessel", name: "vessel" },
    { type: "state", fieldname: "Voyage No", name: "voyNo" },
    { type: "state", fieldname: "LC No", name: "lC_Number" },
    { type: "state", fieldname: "Freight Forwarder", name: "freightForward" },
    { type: "state", fieldname: "Shipping Term", name: "shippingTerm" },
    { type: "state", fieldname: "Invoice No", name: "InvoiceNo" },
    { type: "state", fieldname: "Freight Term", name: "freightTerm" },
    { type: "state", fieldname: "Invoice Total Amount", name: "totalAmount" },
    { type: "productState", fieldname: "Quantity", name: "noOfPkgs" },
    { type: "productState", fieldname: "Product Item", name: "item" },
    { type: "productState", fieldname: "Gross Weight", name: "grossWeight" },
    { type: "productState", fieldname: "Net Weight", name: "netWeight" },
    { type: "productState", fieldname: "Harmonized System Code", name: "harmonizedSystemCode" },
  ];
  

export default function FieldsDialog({ openDialog, handleClose, selectField }) {
    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={openDialog}
                onClose={handleClose}
            >
                <DialogTitle>Choose Field</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} style={{ paddingTop: "15px" }}>
                        {fieldLabels.map((field, index) => {
                            return (
                                <Grid key={index} item xs={3} sm={3} md={3}>
                                    <div className='field-dialog' onClick={()=>selectField(field)}>
                                        <span>{field.fieldname}</span>
                                    </div>
                                </Grid>
                            )
                        })}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}