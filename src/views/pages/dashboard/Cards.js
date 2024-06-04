import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    height: "130px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 180,
        height: 170,
        background:
            theme.palette.mode === 'dark'
                ? `linear-gradient(210.04deg, ${theme.palette.secondary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
                : theme.palette.secondary[800],
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -85,
            right: -95
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 180,
        height: 175,
        background:
            theme.palette.mode === 'dark'
                ? `linear-gradient(140.9deg, ${theme.palette.secondary.dark} -14.02%, rgba(144, 202, 249, 0) 85.50%)`
                : theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -135,
            right: -10
        }
    }
}));

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const DashboardCard = ({ isLoading, List, Icon, title,col }) => {

    const theme = useTheme();

    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <div style={{
                                // background: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light,
                                width: "100%",
                                borderRadius: "6px",
                                // padding: "20px",
                                marginBottom: "14px",
                                // boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
                                marginTop: "-10px"
                            }}>
                                <Typography variant="h3" style={{
                                    color: theme.palette.mode === 'dark'
                                        ? `linear-gradient(210.04deg, ${theme.palette.secondary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
                                        : theme.palette.secondary[800]
                                }}>
                                    {title}
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        {List.length > 0 && List.map((item) => {

                            return (<Grid item xs={col}>
                                <CardWrapper border={false} content={true}>
                                    <Box sx={{ p: 0 , m : "-12px"}}>
                                        <Grid container direction="column">
                                            <Grid item>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item>
                                                        <div
                                                            style={{
                                                                background:
                                                                    theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light,
                                                                borderRadius: "6px",
                                                                padding: "6px 8px 4px 8px",
                                                                boxShadow: "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
                                                                borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
                                                            }}
                                                        >
                                                            <Icon style={{
                                                                color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
                                                            }} />
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item>
                                                <Grid container alignItems="center">
                                                    <Grid item>
                                                        <Typography sx={{
                                                            fontSize: '2rem', fontWeight: 500, mr: 1, mt: 0.7, mb: 0.2, color: theme.palette.mode === 'dark'
                                                                ? `linear-gradient(210.04deg, ${theme.palette.secondary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
                                                                : theme.palette.secondary[800]
                                                        }}>
                                                            {item.statusCount}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item sx={{ mb: 1 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '0.8rem',
                                                        fontWeight: 400,
                                                        color: theme.palette.mode === 'dark'
                                                            ? `linear-gradient(140.9deg, ${theme.palette.secondary.dark} -14.02%, rgba(144, 202, 249, 0) 85.50%)`
                                                            : theme.palette.secondary[800]
                                                    }}
                                                // variant="caption"
                                                >
                                                    {item.status}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </CardWrapper>
                            </Grid>)
                        }
                        )}
                    </Grid>
                </>
            )}
        </>
    );
};

DashboardCard.propTypes = {
    isLoading: PropTypes.bool
};

export default DashboardCard;
