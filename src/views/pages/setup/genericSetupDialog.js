import React, { useState, useEffect } from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import AxiosService from "service";
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import NumberFormat from 'react-number-format';
import { genericSetup } from "validation"
import CustomDialog from "ui-component/CustomDialog";
import CustomSelect from 'ui-component/CustomSelect';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));

export default function GenericSetupDialog({
    open,
    handleClose,
    item,
    getList,
    name,
    InsertService,
    UpdateService,
    label,
    hasDropdown,
    dropDownProps = {},
    options,
    dropDownService
}) {

    const theme = useTheme();
    const dispatch = useDispatch();
    const [error, setError] = useState({})
    const [list, setList] = useState([])
    const [isStateReady, setisStateReady] = useState(false)
    const [state, setState] = useState(
        hasDropdown ?
            {
                [name]: "",
                [dropDownProps.name]: 0
            }
            :
            {
                [name]: "",
            }
    )

    const onhandleSubmit = () => {

        if (item) {

            const { creationDate, isActive, ...rest } = state;

            UpdateService(rest).then((res) => {
                let { data, message } = res?.data;

                dispatch(
                    openSnackbar({
                        open: true,
                        message: message,
                        variant: 'alert',
                        alert: {
                            color: message === "Updated successfully." ? 'success' : "error"
                        },
                        close: true
                    })
                );
                getList();
                handleClose();
            })
        }
        else {

            debugger
            InsertService(state).then((res) => {
                let { data, message } = res?.data;

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
                getList();
                handleClose();
            })
        }
    }

    const getDropDownList = () => {

        dropDownService().then((res) => {
            let { data, message } = res?.data;
            setList(data);
        })

    }

    const handleSubmit = () => {

        let model = {
            setupValue: state[name]
        }
        genericSetup
            .validate(model, { abortEarly: false })
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
        setError({ ...error, setupValue: null })

    }

    useEffect(() => {

        if (item) {
            setState(item)
        }

        if (hasDropdown) {
            getDropDownList()
        }
    }, [item])

    useEffect(() => {

        if (hasDropdown && isStateReady) {
            if (state[dropDownProps.name] === 0) {
                setState({ ...state, [name]: "" })
            }
        }
        else{
            setisStateReady(true)
        }
    }, [state[dropDownProps.name], isStateReady])

    return (
        <CustomDialog
            open={open}
            handleClose={handleClose}
            title={item ? "Update " : "Add " + label}
            fullWidth={true}
            maxWidth={"xs"}
            isAction={true}
            handleSubmit={handleSubmit}
            submitTitle={item ? "Update" : "Add"}
            Icon={item ? "edit" : "add"}
        >
            <Grid container spacing={2}>
                {hasDropdown && <Grid item xs={12}>
                    <CustomSelect
                        generateList={false}
                        label={dropDownProps.label}
                        onChange={handleChange}
                        size="small"
                        name={dropDownProps.name}
                        InputLabelProps={{ shrink: true }}
                        state={state}
                        disabled={false}
                        setState={setState}
                        isInt={true}
                        error={error}
                        options={list.map((item) => ({
                            value: item[options.value],
                            label: item[options.label],
                        }))}
                    />
                </Grid>}

                <Grid item xs={12}>
                    <StyledTextField size="small" disabled={hasDropdown && state[dropDownProps.name] === 0 ? true : false} helperText={error.setupValue} error={!!error.setupValue} InputLabelProps={{ shrink: true }} fullWidth onChange={handleChange} value={state[name]} name={name} label={label} />
                </Grid>
            </Grid>
        </CustomDialog>
    )

}