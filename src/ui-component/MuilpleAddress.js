import React, { useState, useEffect } from 'react';
import { Grid, IconButton, TextField, InputAdornment } from '@mui/material';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useTheme, styled } from '@mui/material/styles';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

export default function MuilpleAddress({ row = 1, multiline = false, col, list, setList, field, error, handleChange, state,}) {

    const theme = useTheme();


    const handleAdd = () => {

        if (list.length < 5) {
            const newArray = [...list, { address: '', error : null }];
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
        newArray[name] = { address: value, error : null };
        setList(newArray);

    }

    return (
        <>
            <Grid item xs={col}>

                <TextField InputProps={{
                    endAdornment: <InputAdornment position="end"><ControlPointIcon onClick={handleAdd} style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, cursor: "pointer" }} /></InputAdornment>,
                }}
                    multiline={multiline} rows={row} helperText={error[field]} error={!!error[field]} InputLabelProps={{ shrink: true }} fullWidth size="small" onChange={handleChange} value={state[field]} name={field} label="Email" />
            </Grid>
            {
                list.length > 0 &&
                list.map((item, index) => {
                    return (
                        <Grid item xs={col}>
                            <TextField

                                InputProps={{
                                    endAdornment: <InputAdornment position="end"><RemoveCircleOutlineIcon onClick={() => handleRemove(index)} style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, cursor: "pointer" }} /></InputAdornment>,
                                }}
                                helperText={item.error} error={!!item.error}
                                InputLabelProps={{ shrink: true }} fullWidth onChange={handleListChange} multiline={multiline} rows={row} value={item.address} name={index} label="Email (Optional)" size="small" />
                        </Grid>
                    )
                })
            }
        </>
    )
}