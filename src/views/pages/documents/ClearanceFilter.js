import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { Grid, Dialog, DialogActions, DialogContent, TextField, Button, MenuItem, Toolbar, Tooltip, IconButton, DialogTitle } from '@mui/material';
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
import AutoComplete from 'ui-component/AutoComplete';
import CustomSelect from 'ui-component/CustomSelect';
import CustomDropdowns from "ui-component/CustomDropdowns";
import CustomDialog from "ui-component/CustomDialog";

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

export default function ClearanceFilter(props) {

    let {
        filter,
        handleClose,
        open,
        setFilter,
        generateList = false,
        setOptionsList,
        OptionsList,
        title = "",
        FILTER_,
        rfp = false,
        consignee = false
    } = props;


    const [customTypeList, setCustomTypeList] = useState([]);
    const [cargoTypeList, setCargoTypeList] = useState([]);
    const [itemCategoryList, setitemCategoryList] = useState([]);
    const [teminalList, setTerminalList] = useState([]);
    const [collectorateList, setCollectorateList] = useState([]);
    const [shipmentDetailsList, setShipmentDetailsList] = useState([]);
    const [cargoTypeDetailList, setcargoTypeDetailList] = useState([]);
    const [rfpStatusList, setRFPstatusList] = useState([]);
    const [consigneestatusList, setConsigneestatusList] = useState([]);
    const [isClear, setisClear] = useState(false);


    const getCustomType = () => {

        AxiosServices.getCustomType().then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setCustomTypeList(data)
            }

        })
    }

    const getCargoType = () => {

        AxiosServices.getCargoType().then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setCargoTypeList(data)
            }

        })
    }

    const getItemCategory = () => {

        AxiosServices.getItemCategory().then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setitemCategoryList(data)
            }

        })
    }

    const getTerminal = () => {

        AxiosServices.getTerminal().then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setTerminalList(data)
            }

        })
    }

    const getRFPstatus = () => {

        AxiosServices.getRFPstatus().then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setRFPstatusList(data)
            }

        })
    }
    const getConsigneestatus = () => {

        AxiosServices.getConsigneestatus().then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setConsigneestatusList(data)
            }

        })
    }

    const getCollectorate = (Id) => {

        AxiosServices.getCollectorate({ customTypeID: Id }).then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setCollectorateList(data)
            }

        })
    }

    const getShipmentTypeDetail = (Id) => {

        AxiosServices.getShipmentTypeDetail({ customTypeID: Id }).then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setShipmentDetailsList(data)
            }

        })
    }

    const getCargoTypeDetail = (Id) => {

        AxiosServices.getCargoTypeDetail({ cargoTypeID: Id }).then((res) => {

            let { data, message } = res?.data;
            if (data) {
                setcargoTypeDetailList(data)
            }

        })
    }

    const handleFilter = () => {
        setisClear(true)
    }

    const handleChange = (event) => {
        let { name, value } = event.target;
        setFilter({ ...filter, [name]: value })

        if (name === "customTypeID") {
            getShipmentTypeDetail(value)
            getCollectorate(value)
        }
        if (name === "cargoTypeID") {
            getCargoTypeDetail(value)
        }
    };

    useEffect(() => {
        setFilter({ ...filter, shipmentTypeDetailID: 0 })
    }, [filter.customTypeID])

    useEffect(() => {
        setFilter({ ...filter, cargoTypeDetailID: 0 })
    }, [filter.cargoTypeID])

    useEffect(() => {
        getRFPstatus()
        getConsigneestatus()
        getCustomType()
        getCargoType()
        getItemCategory()
        getTerminal()
        getCollectorate(0)
        getShipmentTypeDetail(0)
        getCargoTypeDetail(0)
    }, []);

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={title}
            fullWidth={true}
            maxWidth={"md"}
            isAction={true}
            submitTitle={"Done"}
            Icon={"filter"}
            handleReset={handleFilter}
            isReset={true}
        >
            <Grid container spacing={3}>
                <CustomDropdowns
                    filter={filter}
                    setFilter={setFilter}
                    FILTER_={FILTER_}
                    customer={4}
                    fileno={4}
                    isClearFromParent={isClear}
                    setisClear={setisClear}
                />
                <Grid item xs={4}>
                    <CustomSelect
                        generateList={generateList}
                        setOptionsList={setOptionsList}
                        OptionsList={OptionsList}
                        label="Shipment Type"
                        onChange={handleChange}
                        size="small"
                        name="customTypeID"
                        InputLabelProps={{ shrink: true }}
                        state={filter}
                        disabled={false}
                        setState={setFilter}
                        isInt={true}
                        options={customTypeList.map((item) => ({
                            value: item.customTypeID,
                            label: item.customType,
                        }))}
                    />
                </Grid>
                <Grid item xs={4}>
                    <CustomSelect
                        generateList={generateList}
                        setOptionsList={setOptionsList}
                        OptionsList={OptionsList}
                        label="Shipment Type Details"
                        onChange={handleChange}
                        size="small"
                        name="shipmentTypeDetailID"
                        InputLabelProps={{ shrink: true }}
                        state={filter}
                        disabled={false}
                        setState={setFilter}
                        isInt={true}
                        options={shipmentDetailsList.map((item) => ({
                            value: item.shipmentTypeDetailID,
                            label: item.shipmentTypeDetailName,
                        }))}
                    />
                </Grid>
                <Grid item xs={4}>
                    <CustomSelect
                        generateList={generateList}
                        setOptionsList={setOptionsList}
                        OptionsList={OptionsList}
                        label="Cargo Type"
                        onChange={handleChange}
                        size="small"
                        name="cargoTypeID"
                        InputLabelProps={{ shrink: true }}
                        state={filter}
                        disabled={false}
                        setState={setFilter}
                        isInt={true}
                        options={cargoTypeList.map((item) => ({
                            value: item.cargoTypeID,
                            label: item.cargoTypeName,
                        }))}
                    />
                </Grid>
                <Grid item xs={4}>
                    <CustomSelect
                        generateList={generateList}
                        setOptionsList={setOptionsList}
                        OptionsList={OptionsList}
                        label="Cargo Type Details"
                        onChange={handleChange}
                        size="small"
                        name="cargoTypeDetailID"
                        InputLabelProps={{ shrink: true }}
                        state={filter}
                        disabled={false}
                        setState={setFilter}
                        isInt={true}
                        options={cargoTypeDetailList.map((item) => ({
                            value: item.cargoTypeDetailID,
                            label: item.cargoTypeDetailName,
                        }))}
                    />
                </Grid>
                <Grid item xs={4}>
                    <CustomSelect
                        generateList={generateList}
                        setOptionsList={setOptionsList}
                        OptionsList={OptionsList}
                        label="Item Category"
                        onChange={handleChange}
                        size="small"
                        name="itemCategoryID"
                        InputLabelProps={{ shrink: true }}
                        state={filter}
                        disabled={false}
                        setState={setFilter}
                        isInt={true}
                        options={itemCategoryList.map((item) => ({
                            value: item.itemCategoryID,
                            label: item.itemCategoryName,
                        }))}
                    />
                </Grid>
                <Grid item xs={4}>
                    <CustomSelect
                        generateList={generateList}
                        setOptionsList={setOptionsList}
                        OptionsList={OptionsList}
                        label="Terminal"
                        onChange={handleChange}
                        size="small"
                        name="terminalID"
                        InputLabelProps={{ shrink: true }}
                        state={filter}
                        disabled={false}
                        setState={setFilter}
                        isInt={true}
                        options={teminalList.map((item) => ({
                            value: item.terminalID,
                            label: item.terminalName,
                        }))}
                    />
                </Grid>
                <Grid item xs={4}>
                    <CustomSelect
                        generateList={generateList}
                        setOptionsList={setOptionsList}
                        OptionsList={OptionsList}
                        label="Collectorate"
                        onChange={handleChange}
                        size="small"
                        name="collectorateID"
                        InputLabelProps={{ shrink: true }}
                        state={filter}
                        disabled={false}
                        setState={setFilter}
                        isInt={true}
                        options={collectorateList.map((item) => ({
                            value: item.collectorateID,
                            label: item.collectorateName,
                        }))}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={filter.billOflading} name="billOflading" label="Bill of Lading" />
                </Grid>
                <Grid item xs={4}>
                    <TextField fullWidth InputLabelProps={{ shrink: true }} size="small" onChange={handleChange} value={filter.vessel} name="vessel" label="Vessel" />
                </Grid>
                {rfp &&
                    <Grid item xs={4}>
                        <CustomSelect
                            generateList={generateList}
                            setOptionsList={setOptionsList}
                            OptionsList={OptionsList}
                            label="RFP Status"
                            onChange={handleChange}
                            size="small"
                            name="rfpStatusID"
                            InputLabelProps={{ shrink: true }}
                            state={filter}
                            disabled={false}
                            setState={setFilter}
                            isInt={true}
                            options={rfpStatusList.map((item) => ({
                                value: item.rfpStatusID,
                                label: item.rfpStatus,
                            }))}
                        />
                    </Grid>}

                {consignee &&
                    <Grid item xs={4}>
                        <CustomSelect
                            generateList={generateList}
                            setOptionsList={setOptionsList}
                            OptionsList={OptionsList}
                            label="Consignee Status"
                            onChange={handleChange}
                            size="small"
                            name="consigneeStatusID"
                            InputLabelProps={{ shrink: true }}
                            state={filter}
                            disabled={false}
                            setState={setFilter}
                            isInt={true}
                            options={consigneestatusList.map((item) => ({
                                value: item.consigneeStatusID,
                                label: item.consigneeStatus,
                            }))}
                        />
                    </Grid>}
            </Grid>
        </CustomDialog>

    );
}