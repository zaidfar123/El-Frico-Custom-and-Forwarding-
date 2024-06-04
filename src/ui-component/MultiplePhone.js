import React, { useState, useEffect } from 'react';
import { Grid, IconButton, TextField, InputAdornment } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTheme, styled } from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import NumberFormat from 'react-number-format';

export default function MultiplePhone({ row = 1, multiline = false, col, list, setList, field, error, handleChange, state }) {

    const theme = useTheme();


    const handleAdd = () => {

        if (list.length < 5) {

            const newArray = [...list, { phone: '' }];
            setList(newArray);

        }
    }

    const handleRemove = (indexToRemove) => {
        const newData = [...list];
        newData.splice(indexToRemove, 1);
        setList(newData);
    }

    const handleListChange = (event) => {

        let { name, value } = event.target;
        const newArray = [...list];
        newArray[name] = { phone: value };
        setList(newArray);

    }

    return (
        <>
            <Grid item xs={col}>
                <NumberFormat
                    InputProps={{
                        endAdornment: <InputAdornment position="end"><ControlPointIcon onClick={handleAdd} style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, cursor: "pointer" }} /></InputAdornment>,
                    }}
                    multiline={multiline}
                    rows={row}
                    helperText={error[field]}
                    error={!!error[field]}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    customInput={TextField}
                    size="small"
                    onChange={handleChange}
                    value={state[field]}
                    name={field}
                    label="Phone Number"
                    format="+92 ###-#######"
                    mask="_"
                />
            </Grid>
            {
                list.length > 0 &&
                list.map((item, index) => {
                    return (
                        <Grid item xs={col}>
                            <NumberFormat
                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><RemoveCircleOutlineIcon onClick={() => handleRemove(index)} style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, cursor: "pointer" }} /></InputAdornment>,
                                }}
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                onChange={handleListChange}
                                multiline={multiline}
                                rows={row}
                                value={item.phone}
                                customInput={TextField}
                                name={index}
                                label="Phone Number (Optional)"
                                size="small"
                                format="+92 ###-#######"
                                mask="_"
                            />
                        </Grid>
                    )
                })
            }
        </>
    )
}