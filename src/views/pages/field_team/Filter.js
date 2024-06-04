// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TextField, MenuItem, Button } from '@mui/material';
import AxiosServices from "service";
import AutoComplete from 'ui-component/AutoComplete';
import { useTheme, styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));

export default function Filter({filter,setFilter,FILTER_}) {

    const theme = useTheme();
    const [FileNoList, setFileNoList] = useState([])

    const OptionDescription = (option) => option.customerName || "";
    const [selectedOptionCustomer, setSelectedOptionCustomer] = useState("");

    const setOptionsChanges = (options, field) => {
        
        if (options) {
            setFilter({ ...filter, fileNo: "", [field]: options.customerID })
        } else {
            setFilter({ ...filter, fileNo: "", [field]: 0 })
        }
    };

    const handleChange = (event) => {
        let { name, value } = event.target;
        setFilter({ ...filter, [name]: value })
    };

    const handleClear = () => {
        setSelectedOptionCustomer("")
        setFilter(FILTER_)
    };

    useEffect(() => {

        if (filter.customerID !== 0) {
            getCustomerFileNo()
        }

    }, [filter.customerID])


    const getCustomerFileNo = () => {
        let model = {
            customerID: filter.customerID,
            customTypeID: 0,
            fileNo: "",
            valueSize: 10
        }
        AxiosServices.getCustomerFileNo(model).then((res) => {
            let { data, message } = res?.data;
            if (data) {
                setFileNoList(data)
            }
            else {
                setFileNoList([])
            }
        })
    }

    return (
     
        <div className="searchCard" style={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}>
                    <p className="heading">Filter</p>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <AutoComplete
                                setOptionsChanges={setOptionsChanges}
                                state={filter}
                                errors={{}}
                                selectedOption={selectedOptionCustomer}
                                setSelectedOption={setSelectedOptionCustomer}
                                searchSuggestions={AxiosServices.searchCustomer}
                                getOptionLabel={OptionDescription}
                                field={"customerID"}
                                label={"Customer"}
                                disabled={false}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <StyledTextField
                                value={filter.fileNo}
                                label="File No"
                                onChange={handleChange}
                                size="small"
                                name="fileNo"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                select
                                disabled={filter.customerID === 0}
                            >
                                {FileNoList.length > 0 && FileNoList.map((file, index) => (
                                    <MenuItem key={index} value={file.fileNo}>
                                        {file.fileNo}
                                    </MenuItem>
                                ))}
                            </StyledTextField>
                        </Grid>
                        <Grid item xs={3}>
                            <StyledTextField
                                value={filter.billOfLading}
                                label="Bill of Lading"
                                onChange={handleChange}
                                size="small"
                                name="billOfLading"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            >
                            </StyledTextField>
                        </Grid>
                        <Grid item xs={3}>
                            <StyledTextField
                                value={filter.vessel}
                                label="Vessel"
                                onChange={handleChange}
                                size="small"
                                name="vessel"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            >
                            </StyledTextField>
                        </Grid>
                        <Grid item xs={3}>
                            <StyledTextField
                                value={filter.voyNo}
                                label="Voyage No"
                                onChange={handleChange}
                                size="small"
                                name="voyNo"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            >
                            </StyledTextField>
                        </Grid>
                        <Grid item xs={3} className="searchCard-button">
                            <Button variant="outlined" fullWidth
                                onClick={handleClear}
                            >
                                Clear Filter
                            </Button>
                        </Grid>

                    </Grid>
        </div>
         
    );
}
