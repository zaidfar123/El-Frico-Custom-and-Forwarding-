// material-ui
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, LinearProgress, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// ===========================|| WIDGET STATISTICS - PROJECT TASK CARD ||=========================== //

const SeriesCards = ({ List, title }) => {

    const theme = useTheme();
    const [count, setCount] = useState(0)

    useEffect(() => {

        const totalStatusCount = List.reduce((total, item) => total + item.statusCount, 0);
        setCount(totalStatusCount)

    }, [List])

    return (
        <MainCard title={title}>
            <Grid container alignItems="center" spacing={gridSpacing}>
                {List.length > 0 && List.map((item) => {
                    return (
                        <Grid item xs={12} lg={3} sm={6}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" align="left">
                                        {item.status}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h2" align="left"
                                    sx={{
                                        fontSize: '2rem', fontWeight: 500, mr: 1, mt: 0.7, mb: 0.2, color: theme.palette.mode === 'dark'
                                            ? `linear-gradient(210.04deg, ${theme.palette.secondary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
                                            : theme.palette.secondary[800]
                                    }}
                                    >
                                        {item.statusCount}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <LinearProgress variant="determinate" value={(count/100)*item.statusCount} color="primary"/>
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        </MainCard>
    );
};

export default SeriesCards;
