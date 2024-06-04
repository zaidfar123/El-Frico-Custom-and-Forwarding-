import React, { useState, useEffect } from 'react';
import {  TextField, Typography, TableCell, TableRow ,InputAdornment} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import "./style.css";;
import utilsJS from "utilsJS";


export default function ExcelDynamicRows({ Index, itemObject, onChange, onLabelChange={}, hasLabel = false, hasSingleText = true , hasSDCharges= false}) {

    const theme = useTheme();

    const fontStyle = {fontSize : "11px", color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }
    const formulaStyle = { fontSize : "10px", fontStyle: "italic" }

    const backgroundStyle = { background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light, fontWeight: 600 }


    return (
        <TableRow>
            <TableCell align="center" colSpan={!hasSingleText ? 8 : 6}>
                <div className="table-splitter">
                    <Typography variant="h6">{Index + 1}</Typography>
                    {hasLabel ?
                        <TextField
                            value={itemObject[Index].labelValue}
                            variant="standard"
                            size="small"
                            onChange={onLabelChange}
                            name={itemObject[Index].labelName}
                        />
                        :
                        <Typography variant="h6" style={fontStyle}>{itemObject[Index].title}</Typography>
                        }
                        <Typography variant="h6" style={formulaStyle}>{itemObject[Index].formula}</Typography>
                        {hasSDCharges && 
                            <TextField
                                value={itemObject[Index].sdValue}
                                variant="standard"
                                size="small"
                                className='customTextField'
                                onChange={onChange}
                                name={itemObject[Index].sdName}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">+ PSW Token & Exc</InputAdornment>,
                                }}
                            />
                        }

                </div>
            </TableCell>

           {hasSingleText && <TableCell align="center" colSpan={2}>
                <div className="table-splitter">
                    <Typography variant="h6" style={fontStyle}>
                        <TextField
                            value={itemObject[Index].percentValue}
                            variant="standard"
                            size="small"
                            onChange={onChange}
                            name={itemObject[Index].percentName}
                            className='customTextField'
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                        />
                    </Typography>
                </div>
            </TableCell>}
            <TableCell align="center" colSpan={2}>
                <div className="table-splitter">
                    <Typography variant="h6" style={fontStyle}>
                        <TextField
                            value={itemObject[Index].Value}
                            variant="standard"
                            size="small"
                            onChange={onChange}
                            className='customTextField'
                            name={itemObject[Index].valueName}
                        />
                    </Typography>
                </div>
            </TableCell>
            <TableCell align="center" colSpan={1}>
                <div className="table-splitter">
                    <Typography variant="h6">Rs.</Typography>
                    <Typography variant="h6" style={fontStyle}>{utilsJS.getFormattedAmount(Math.round(itemObject[Index].result))}</Typography>
                </div>
            </TableCell>
        </TableRow>
    )
}