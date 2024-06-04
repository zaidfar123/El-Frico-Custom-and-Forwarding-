import React, { useState, useEffect } from 'react';
import { Switch, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, IconButton, Tooltip, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';


export default function SwitchCard({ title = null, name, handleChange, icon }) {

    const theme = useTheme();

    return (

        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid", borderRadius: "8px", borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginLeft: "6px" }}>
                {icon}
                <Typography variant="h6">
                    {title}
                </Typography>
            </div>

            <Switch
                checked={name}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
            />
        </div>

    );
}