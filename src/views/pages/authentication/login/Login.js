import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import LogoBlue from "assets/images/LogoBlue.png"
import LogoWhite from "assets/images/LogoWhite.png"
// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import JWT_Login from './JWT_Login';
import background from "assets/images/background.jpg";

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const loginStyles = {
        backgroundImage: `url(${background})`, // Replace 'path_to_your_image.jpg' with your image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    const logoheading = {
        position: "absolute",
        top: "50%",
        left: "30%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        flexDirection: "column",
        gap: "28px",
    };

    const headingSpan = {
        color: '#FFFFFF',
        fontSize: "45px",
        fontWeight: 500,
        letterSpacing: "8px",
    };

    const headingSub = {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    };

    const headingSubSpan = {
        ...headingSpan, // Inherit some common properties
        fontSize: "25px",
        fontWeight: 300,
        letterSpacing: "7.5px",
    };
    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="space-between" alignItems="center" sx={{ ...loginStyles, minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <div style={logoheading}>
                                <span style={headingSpan}>El-Frico</span>
                                <div style={headingSub}>
                                    <span style={headingSubSpan}>Clearing &</span>
                                    <span style={headingSubSpan}>Forwarding Solution</span>
                                </div>
                            </div>
                        </Grid>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 0 }}>
                                        <Link to="#">
                                            <img src={LogoBlue} alt="Logo" style={{ width: '140px', height: "50px" }} />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h3'}
                                                    >
                                                        Login
                                                    </Typography>
                                                    {/* <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Enter your credentials to continue
                                                    </Typography> */}
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <JWT_Login />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" style={{ marginTop: "6px" }} justifyContent="center" spacing={1}>

                                                    <Typography
                                                        variant="caption"
                                                        fontSize="14px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Powered by <span style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, fontWeight: '500', letterSpacing: "1.5px", textTransform: "uppercase", paddingLeft: "6px" }}>Digital Landscape</span>
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* <Grid item xs={12}>
                                        <Divider />
                                    </Grid> */}
                                    {/* <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                component={Link}
                                                to={isLoggedIn ? '/pages/register/register3' : '/register'}
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none' }}
                                            >
                                                Don&apos;t have an account?
                                            </Typography>
                                        </Grid>
                                    </Grid> */}
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Login;
