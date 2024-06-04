import React, { useEffect } from 'react';
import { TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));

const CustomSelect = ({
    options,
    label,
    onChange,
    disabled,
    name,
    InputLabelProps,
    size,
    state,
    error = {},
    setState,
    isInt,
    generateList = false,
    setOptionsList,
    OptionsList
}) => {

    const theme = useTheme();

    const getInputAdornment = () => {

        if (state[name] !== 0 && state[name] !== "") {
            return (
                <InputAdornment position="end" style={{ marginRight: "12px" }}>
                    <CloseIcon onClick={() => setState({ ...state, [name]: isInt ? 0 : "" })} color='primary' style={{ cursor: 'pointer', fontSize: "20px" }} />
                </InputAdornment>
            )
        }
        else {
            return null
        }
    }

    const updateStateArray = (key, value) => {
        // Find the index of the item with the provided key
        const index = OptionsList.findIndex((item) => Object.keys(item).includes(key));

        // If the key exists, update its value; otherwise, add a new object
        if (value === 0 || value === "") {
            // Remove the key-value pair if the value is 0 or an empty string
            if (index !== -1) {
                const updatedDataArray = [...OptionsList];
                updatedDataArray.splice(index, 1);
                setOptionsList(updatedDataArray);
            }
        }
        else {
            if (index !== -1) {
                const updatedDataArray = [...OptionsList];
                updatedDataArray[index] = { [key]: value };
                setOptionsList(updatedDataArray);
            } else {
                setOptionsList([...OptionsList, { [key]: value, initialValue: isInt ? 0 : "" }]);
            }
        }

    };

    useEffect(() => {

        if (generateList) {
            if (state[name] !== 0 && state[name] !== "") {
                let values = options.find(x => x.value === state[name])
                updateStateArray(name, values.label)
            }
            else {
                updateStateArray(name, state[name])
            }
        }
        console.log("OptionsList", OptionsList)

    }, [state[name]])

    return (
        <div className="custom-select">
            <StyledTextField
                value={state[name]}
                label={label}
                onChange={onChange}
                size={size}
                name={name}
                InputLabelProps={InputLabelProps}
                fullWidth
                select
                disabled={disabled}
                helperText={error[name]}
                error={!!error[name]}
                InputProps={{
                    endAdornment: getInputAdornment()
                }}
            >
                {options.length > 0 &&
                    options.map((item, index) => (
                        <MenuItem key={index} value={item.value} >
                            {item.label}
                        </MenuItem>
                    ))}
            </StyledTextField>
        </div>
    );
};

export default CustomSelect;
