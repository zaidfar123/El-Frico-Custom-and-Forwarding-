import React, { useState, memo, useEffect } from 'react';
import {Autocomplete} from '@mui/material';
import {TextField,InputAdornment} from '@mui/material';
// import StyledTooltip from "./StyledTooltip.jsx";
// import jsUtils from '../../utils/jsUtils.js';

const ComboAutoComplete = ({ List, label, name }) => {

    const [selectedOption, setSelectedOption] = React.useState(null);

  // Function to get the selected option
  const handleOnChange = (event, newValue) => {
    
    setSelectedOption(newValue);
  };

  // Get the index of the option to be pre-selected
//   const preSelectedIndex = List.findIndex(option => option.year === 1994); // Change this condition based on your ID

//   // Pre-select an option based on index
//   const preSelectedValue = preSelectedIndex !== -1 ? List[preSelectedIndex] : null;

    return (
        <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={List}
        value={selectedOption} // Set the value to the selected option or pre-selected value
        onChange={handleOnChange} // Handle selection changes
        getOptionLabel={(option) => option[name]}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
        )
};

export default memo(ComboAutoComplete)