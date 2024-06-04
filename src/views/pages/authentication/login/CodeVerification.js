import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
// import Logo from 'assets/images/icons/sync3.png';
import LogoBlue from "assets/images/LogoBlue.png"

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AnimateButton from 'ui-component/extended/AnimateButton';
import AuthCodeVerification from './AuthCodeVerification';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { useLocation, useNavigate } from 'react-router-dom';
import AxiosService from "service";
import { openSnackbar } from 'store/slices/snackbar';
import { useSelector, useDispatch } from 'react-redux';
import background from "assets/images/background.jpg";

// ===========================|| AUTH3 - CODE VERIFICATION ||=========================== //

// Set the number of seconds for the OTP timer
const OTP_TIMER_DURATION = 60;

const CodeVerification = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const [emailStar, setStarEmail] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitting, setisSubmitting] = useState(false)
    const dispatch = useDispatch();

    const [isActive, setisActive] = useState(true)
    const [timeLeft, settimeLeft] = useState("")
    var StateLocation = location?.state;
    let timerOn = true;

    useEffect(() => {
        if (location.state !== null) {
            setisActive(true)
            timer(OTP_TIMER_DURATION);
            
            setEmail(StateLocation.email);
            var EMAIL = StateLocation.email;
            setStarEmail(EMAIL.replace(/(\w{2}).*?@/, '$1****@'));
        }
        else {
            navigate("/login", { replace: true })
        }

    }, [location])

    function timer(remaining) {
        var m = Math.floor(remaining / 60);
        var s = remaining % 60;

        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        settimeLeft(m + ':' + s);
        remaining -= 1;

        if (remaining >= 0 && timerOn) {
            setTimeout(function () {
                timer(remaining);
            }, 1000);
            return;
        }

        if (!timerOn) {
            return;
        }
        setisActive(false)
        setisSubmitting(false)
    }

    const ResendCode = async () => {

        setisSubmitting(true)
        var response = await AxiosService.resendOTP({ email })
        let { message } = response?.data;
        dispatch(
            openSnackbar({
                open: true,
                message: message,
                variant: 'alert',
                alert: {
                    color: message === "OTP has been sent to your registered email address." ? 'success' : "error"
                },
                close: true
            })
        );
        setisSubmitting(false)
        setisActive(true)
        timer(OTP_TIMER_DURATION);
    }


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
                                                        Enter Verification Code
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="0.80rem"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        We’ve send you OTP on {emailStar}
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <AuthCodeVerification email={email} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                // component={Link}
                                                to="#"
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none' }}
                                                textAlign={matchDownSM ? 'center' : 'inherit'}
                                            >
                                                Did not receive the email? Check your spam folder, or
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {!isActive ?
                                            <AnimateButton>
                                                <LoadingButton
                                                    onClick={ResendCode}
                                                    fullWidth
                                                    size="large"
                                                    loading={isSubmitting}
                                                    loadingPosition="center"
                                                    variant="outlined"
                                                    color="secondary"
                                                >
                                                    Resend Code
                                                </LoadingButton>

                                            </AnimateButton>
                                            :
                                            <Grid item container direction="column" alignItems="center" xs={12}>
                                                <Typography
                                                    component={Link}
                                                    to="#"
                                                    variant="subtitle1"
                                                    sx={{ textDecoration: 'none' }}
                                                    textAlign={matchDownSM ? 'center' : 'inherit'}
                                                >
                                                    Resend code in {timeLeft} seconds.
                                                </Typography>
                                            </Grid>
                                        }


                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" style={{ marginTop: "12px" }} justifyContent="center" spacing={1}>

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
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                    <AuthFooter />
                </Grid> */}
            </Grid >
        </AuthWrapper1 >
    );
};

export default CodeVerification;
