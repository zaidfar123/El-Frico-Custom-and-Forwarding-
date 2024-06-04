import React, { useState, memo, useEffect } from 'react';
import { Autocomplete } from '@mui/material';
import { TextField, InputAdornment } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// import StyledTooltip from "./StyledTooltip.jsx";
// import jsUtils from '../../utils/jsUtils.js';

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));

const AutoComplete = ({ state, errors, selectedOption, setSelectedOption, searchSuggestions, getOptionLabel, setOptionsChanges, field, label, disabled = false, model }) => {

    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);

    const handleInputChange = (event, newInputValue) => {

        setInputValue(newInputValue);
        searchSuggestions({ ...model, requestString: newInputValue, valueSize: 10 })
            .then(data => {
                debugger
                setSuggestions(data)
            })
            .catch(e => {
                setSuggestions([])
                console.error(e);
            });

    };

    const handleOptionChange = (event, SelectedOptions) => {
        setSelectedOption(SelectedOptions);
        setOptionsChanges(SelectedOptions, field, state);
        setSuggestions([]);
    };


    useEffect(() => {
        if (state[field] === null) {
            setInputValue('')
            setSelectedOption('')
            setSuggestions([])
        }

    }, [state[field]])

    // const filterOptions = createFilterOptions({
    //     limit: OPTIONS_LIMIT
    //   });

    useEffect(()=>{
        if(open){
            handleInputChange()
        }
        else{
            setSuggestions([])
        }
    },[open])

    return (
        <Autocomplete
            options={suggestions}
            getOptionLabel={getOptionLabel}
            value={selectedOption}
            onChange={handleOptionChange}
            className='autocomplete'
            freeSolo
            disabled={disabled}
            style={{ width: "100%" }}
            onOpen={() => {
                setOpen(true);
              }}
              onClose={() => {
                setOpen(false);
            }}
            renderInput={params => (
                <StyledTextField
                    {...params}
                    label={label}
                    variant="outlined"
                    size="small"
                    helperText={errors[field]}
                    value={inputValue}
                    error={errors[field]}
                    InputLabelProps={{ shrink: true }}
                    onChange={(event) => handleInputChange(event, event.target.value)}
                />
            )}
        />
    );
};

export default memo(AutoComplete)