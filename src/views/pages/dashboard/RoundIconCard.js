import PropTypes from 'prop-types';

// material-ui
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { styled, useTheme } from '@mui/material/styles';

// project imports
// import MainCard from './MainCard';

// ============================|| ROUND ICON CARD ||============================ //

const RoundIconCard = ({ primary, secondary, content, iconPrimary, color, bgcolor, List, col, title }) => {
    const IconPrimary = iconPrimary;
    const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;
    const theme = useTheme();

    return (
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
            <Grid container spacing={1}>
                {List.length > 0 && List.map((item) => {
                    return (<Grid item xs={col}>
                        <MainCard>
                            <Grid container alignItems="center" spacing={0} justifyContent="space-between">
                                <Grid item>
                                    <Stack spacing={1}>
                                        <Typography variant="h5" color="inherit">
                                            {item.status}
                                        </Typography>
                                        <Typography variant="h3">{item.statusCount}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item>
                                    <IconButton sx={{ bgcolor, color, '& .MuiSvgIcon-root': { fontSize: '1.5rem' } }} size="large">
                                        {primaryIcon}
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>)

                })}

            </Grid>
        </>
    );
};

RoundIconCard.propTypes = {
    primary: PropTypes.string,
    secondary: PropTypes.string,
    content: PropTypes.string,
    iconPrimary: PropTypes.object,
    color: PropTypes.string,
    bgcolor: PropTypes.string
};

export default RoundIconCard;
