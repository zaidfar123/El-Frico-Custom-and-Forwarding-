import { useEffect,useState } from 'react';
import useAuth from 'hooks/useAuth';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography, FormHelperText } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AxiosService from "service"
// third-party
import OtpInput from 'react-otp-input-rc-17';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

const AuthCodeVerification = ({ email }) => {
    const theme = useTheme();
    const { loginOTP } = useAuth();
    const [otp, setOtp] = useState("");
    const [isSubmitting, setisSubmitting] = useState(false);
    const [errors, setError] = useState({
        message: ""
    });

    const Verification = async () => {
        
        setError({message : ""})
        setisSubmitting(true)
        var res = await loginOTP({email,otp : parseInt(otp)})
        if(typeof(res) !== "undefined"){
            setError({message : "We were unable to verify your OTP. Please enter a valid OTP."})
        }
        setisSubmitting(false)
    }

    useEffect(()=>{

        if (otp.length === 4) {
            Verification()
        }

    },[otp])

    const borderColor = theme.palette.mode === 'dark' ? theme.palette.grey[200] : theme.palette.grey[300];
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <OtpInput
                    value={otp}
                    onChange={(code)=>setOtp(code)}
                    numInputs={4}
                    isInputNum={true}                    
                    containerStyle={{ justifyContent: 'space-between' }}
                    inputStyle={{
                        width: '100%',
                        margin: '8px',
                        padding: '10px',
                        border: `1px solid ${borderColor}`,
                        fontWeight : 700,
                        color: "black",
                        borderRadius: 4,
                        ':hover': {
                            borderColor:  theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
                        }
                    }}
                    focusStyle={{
                        outline: 'none',
                        border: `2px solid ${ theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}`
                    }}
                />
            </Grid>
            {!!errors.message && <Grid item xs={12}>
                <FormHelperText error>{errors.message}</FormHelperText>
            </Grid>}
            <Grid item xs={12}>
                <LoadingButton
                    onClick={Verification}
                    fullWidth
                    size="large"
                    type="submit"
                    loading={isSubmitting}
                    loadingPosition="center"
                    variant="contained"
                    style={{backgroundColor :  theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}}
                >
                    Continue
                </LoadingButton>
            </Grid>
        </Grid>
    );
};
export default AuthCodeVerification;
