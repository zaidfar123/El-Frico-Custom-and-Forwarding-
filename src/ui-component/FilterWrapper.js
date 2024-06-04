// material-ui
import React from "react";
import { Grid } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

export default function FilterWrapper({
    title,
    children
}) {

    const theme = useTheme();

    return (
        <div className="searchCard" style={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}>
            <p className="heading">{title}</p>
            <Grid container spacing={2} alignItems="center">
                {children}
            </Grid>
        </div>
    );
}
