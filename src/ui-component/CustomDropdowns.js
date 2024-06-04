// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TextField, MenuItem, Button } from '@mui/material';
import AxiosServices from "service";
import AutoComplete from 'ui-component/AutoComplete';
import { useTheme, styled } from '@mui/material/styles';
import CustomSelect from 'ui-component/CustomSelect';
import NumberFormat from 'react-number-format';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));

export default function CustomDropdowns({
    filter,
    setFilter,
    FILTER_,
    customer = null,
    fileno = null,
    billoflading = null,
    vessel = null,
    voy = null,
    ocrid = null,
    ocridAD = null,
    transport = null,
    fileTransport = null,
    clear = null,
    isClearFromParent = false,
    isValidation = false,
    reimbursement = false,
    error = {},
    setError,
    setisClear,
    isEdit = false,
    setisEdit,
    ntn = false,
    employee = false,
    amount = false,
}) {

    const theme = useTheme();

    //CUstomer
    const OptionDescription = (option) => option.customerName || "";
    const [selectedOptionCustomer, setSelectedOptionCustomer] = useState("");

    //File No
    const OptionFileDescription = (option) => option.fileNo || "";
    const [selectedOptionFileNo, setSelectedOptionFileNo] = useState("");
    //Reimbursement
    const [selectedOptionreimbursement, setSelectedOptionreimbursement] = useState("");
    const OptionreimbursmentDescription = (option) => option.reimbursmentCategoryName || "";
    const [transporterList, settransporterList] = useState([]);
    const [userList, setUserList] = useState([])

    const setOptionsChanges = (options, field) => {

        if (options) {

            debugger
            if (field === "customerID") {
                if (ntn) {
                    setFilter({ ...filter, fileNo: "", [field]: options.customerID, ntn: options.ntn, customer: options.customerName });
                }
                else {
                    setFilter({ ...filter, fileNo: "", [field]: options.customerID });
                }
            }
            else if (field === "ocrid") {
                setFilter({ ...filter, [field]: options.ocrid, fileNo: options.fileNo, customerID: options.customerID })
                setSelectedOptionCustomer({ customerName: options.customerName })
            }
            else if (field === "clearingID") {
                setFilter({ ...filter, [field]: options.clearingID, fileNo: options.fileNo, customerID: options.customerID })
                setSelectedOptionCustomer({ customerName: options.customerName })

            }
            else if (field === "reimbursmentCategoryID") {
                setFilter({ ...filter, [field]: options.reimbursmentCategoryID, reimbursmentCategoryName: options.reimbursmentCategoryName })
            }
            else {
                if (ntn) {
                    setFilter({ ...filter, [field]: options.fileNo, customerID: options.customerID, ntn: options.ntn })
                }
                else {
                    setFilter({ ...filter, [field]: options.fileNo, customerID: options.customerID })
                }
                setSelectedOptionCustomer({ customerName: options.customerName })

            }

            isValidation && setError({ ...error, [field]: null });

        } else {

            if (field === "customerID") {
                setFilter({ ...filter, [field]: 0, })
            }
            else if (field === "ocrid") {
                setFilter({ ...filter, [field]: 0, fileNo: null, customerID: 0 })
                setSelectedOptionCustomer("")
            }
            else if (field === "clearingID") {
                setFilter({ ...filter, [field]: 0, fileNo: "", customerID: 0 })
                setSelectedOptionCustomer("")
            }
            else if (field === "reimbursmentCategoryID") {
                setFilter({ ...filter, [field]: 0, reimbursmentCategoryName: "" })
            }
            else {
                setFilter({ ...filter, [field]: "", customerID: 0 })
                setSelectedOptionCustomer("")
            }
        }
    };

    const handleChange = (event) => {
        let { name, value } = event.target;
        setFilter({ ...filter, [name]: value })
        isValidation && setError({ ...error, [name]: null });
    };

    const handleClear = () => {
        setSelectedOptionCustomer("")
        setSelectedOptionFileNo("")
        setSelectedOptionreimbursement("")
        setFilter(FILTER_)
        setisClear(false)
    };

    useEffect(() => {

        if (isClearFromParent) {
            handleClear()
        }

    }, [isClearFromParent])

    useEffect(() => {

        if (isEdit) {
            if (reimbursement) {
                debugger
                setSelectedOptionreimbursement({ reimbursmentCategoryName: filter.reimbursmentCategoryName })
            }
            setisEdit(false)
        }

    }, [isEdit])


    const getDropdowntransporterList = () => {

        AxiosServices.getDropdowntransporterList().then((res) => {

            let { data, message } = res?.data;
            if (data) {
                settransporterList(data)
            }

        })
    }

    const getUserList = () => {

        AxiosServices.getUserList().then((res) => {
            let { data } = res?.data;
            if (data) {
                setUserList(data)
            }
            else {
                setUserList([])
            }
        })
    }

    useEffect(() => {

        getDropdowntransporterList();
        employee && getUserList();

    }, [])

    return (
        <React.Fragment>
            {customer && <Grid item xs={customer}>
                <AutoComplete
                    setOptionsChanges={setOptionsChanges}
                    state={filter}
                    errors={isValidation ? error : {}}
                    selectedOption={selectedOptionCustomer}
                    setSelectedOption={setSelectedOptionCustomer}
                    searchSuggestions={AxiosServices.searchCustomer}
                    getOptionLabel={OptionDescription}
                    field={"customerID"}
                    label={"Customer"}
                    disabled={false}
                    model={{}}
                />
            </Grid>}

            {fileno && <Grid item xs={fileno}>
                <AutoComplete
                    setOptionsChanges={setOptionsChanges}
                    state={filter}
                    errors={isValidation ? error : {}}
                    selectedOption={selectedOptionFileNo}
                    setSelectedOption={setSelectedOptionFileNo}
                    searchSuggestions={AxiosServices.getCustomerFileNo}
                    getOptionLabel={OptionFileDescription}
                    field={"fileNo"}
                    label={"File No"}
                    model={{
                        customerID: filter.customerID,
                        customTypeID: 0,
                    }}
                />
            </Grid>}

            {ocrid && <Grid item xs={ocrid}>
                <AutoComplete
                    setOptionsChanges={setOptionsChanges}
                    state={filter}
                    errors={isValidation ? error : {}}
                    selectedOption={selectedOptionFileNo}
                    setSelectedOption={setSelectedOptionFileNo}
                    searchSuggestions={AxiosServices.getCustomerOCRFileNoDropdown}
                    getOptionLabel={OptionFileDescription}
                    field={"ocrid"}
                    label={"File No"}
                    model={{
                        customerID: filter.customerID,
                        customTypeID: 0,
                    }}
                />
            </Grid>}

            {ocridAD && <Grid item xs={ocridAD}>
                <AutoComplete
                    setOptionsChanges={setOptionsChanges}
                    state={filter}
                    errors={isValidation ? error : {}}
                    selectedOption={selectedOptionFileNo}
                    setSelectedOption={setSelectedOptionFileNo}
                    searchSuggestions={AxiosServices.getCustomerAllFileNoDropdown}
                    getOptionLabel={OptionFileDescription}
                    field={"ocrid"}
                    label={"File No"}
                    model={{
                        customerID: filter.customerID,
                        customTypeID: 0,
                    }}
                />
            </Grid>}

            {fileTransport && <Grid item xs={fileTransport}>
                <AutoComplete
                    setOptionsChanges={setOptionsChanges}
                    state={filter}
                    errors={isValidation ? error : {}}
                    selectedOption={selectedOptionFileNo}
                    setSelectedOption={setSelectedOptionFileNo}
                    searchSuggestions={AxiosServices.getTransportFileNoDropdown}
                    getOptionLabel={OptionFileDescription}
                    field={"clearingID"}
                    label={"File No"}
                    model={{
                        customerID: filter.customerID,
                        customTypeID: 0,
                    }}
                />
            </Grid>}
            {reimbursement && <Grid item xs={reimbursement}>
                <AutoComplete
                    setOptionsChanges={setOptionsChanges}
                    state={filter}
                    errors={isValidation ? error : {}}
                    selectedOption={selectedOptionreimbursement}
                    setSelectedOption={setSelectedOptionreimbursement}
                    searchSuggestions={AxiosServices.getReimbursmentCategoryDropdown}
                    getOptionLabel={OptionreimbursmentDescription}
                    field={"reimbursmentCategoryID"}
                    label={"Reimbursement"}
                    model={{}}
                />
            </Grid>}
            {transport && <Grid item xs={transport}>
                <CustomSelect
                    generateList={false}
                    label="Transport"
                    onChange={handleChange}
                    size="small"
                    name="transporterID"
                    InputLabelProps={{ shrink: true }}
                    state={filter}
                    disabled={false}
                    setState={setFilter}
                    isInt={true}
                    error={error}
                    options={transporterList.map((item) => ({
                        value: item.transporterID,
                        label: item.transporterName,
                    }))}
                />
            </Grid>}
            {employee && <Grid item xs={employee}>
                <CustomSelect
                    generateList={false}
                    label="Employee"
                    onChange={handleChange}
                    size="small"
                    name="userID"
                    InputLabelProps={{ shrink: true }}
                    state={filter}
                    disabled={false}
                    setState={setFilter}
                    isInt={true}
                    error={error}
                    options={userList.map((item) => ({
                        value: item.userID,
                        label: item.userDetailName,
                    }))}
                />
            </Grid>}

            {billoflading && <Grid item xs={billoflading}>
                <StyledTextField
                    value={filter.billOfLading}
                    label="Bill of Lading"
                    onChange={handleChange}
                    size="small"
                    name="billOfLading"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    helperText={error.billOfLading} error={!!error.billOfLading}
                >
                </StyledTextField>
            </Grid>}
            {vessel && <Grid item xs={vessel}>
                <StyledTextField
                    value={filter.vessel}
                    label="Vessel"
                    onChange={handleChange}
                    size="small"
                    name="vessel"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    helperText={error.vessel} error={!!error.vessel}
                >
                </StyledTextField>
            </Grid>}
            {voy && <Grid item xs={voy}>
                <StyledTextField
                    value={filter.voyNo}
                    label="Voyage No"
                    onChange={handleChange}
                    size="small"
                    name="voyNo"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    helperText={error.voyNo}
                    error={!!error.voyNo}
                >
                </StyledTextField>
            </Grid>}
            {amount && <Grid item xs={amount}>
                <NumberFormat
                    format="########"
                    mask=""
                    fullWidth
                    error={!!error.amount}
                    helperText={error.amount}
                    customInput={TextField}
                    label="Amount"
                    onChange={handleChange}
                    value={filter.amount}
                    name="amount"
                    size='small'
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>}
            {clear && <Grid item xs={clear} className="searchCard-button">
                <Button variant="outlined" fullWidth
                    onClick={handleClear}
                >
                    Clear Filter
                </Button>
            </Grid>}
        </React.Fragment>
    );
}
