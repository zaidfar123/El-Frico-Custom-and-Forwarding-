import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Divider, FormControlLabel, Grid, IconButton, MenuItem, Switch, TextField, Typography } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import DesktopWindowsTwoToneIcon from '@mui/icons-material/DesktopWindowsTwoTone';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SmartphoneTwoToneIcon from '@mui/icons-material/SmartphoneTwoTone';
import PhoneIphoneTwoToneIcon from '@mui/icons-material/PhoneIphoneTwoTone';

const deviceStateSX = {
    display: 'inline-flex',
    alignItems: 'center',
    '& >svg': {
        width: 12,
        height: 12,
        mr: 0.5
    }
};

// select options
const currencies = [
    {
        value: 'Washington',
        label: 'Washington'
    },
    {
        value: 'India',
        label: 'India'
    },
    {
        value: 'Africa',
        label: 'Africa'
    },
    {
        value: 'New-York',
        label: 'New York'
    },
    {
        value: 'Malaysia',
        label: 'Malaysia'
    }
];

const experiences = [
    {
        value: 'Startup',
        label: 'Startup'
    },
    {
        value: '2-year',
        label: '2 year'
    },
    {
        value: '3-year',
        label: '3 year'
    },
    {
        value: '4-year',
        label: '4 year'
    },
    {
        value: '5-year',
        label: '5 year'
    }
];

// ==============================|| PROFILE 1 - MY ACCOUNT ||============================== //

const MyAccount = () => {
    const theme = useTheme();

    const [currency, setCurrency] = useState('Washington');
    const handleChange1 = (event) => {
        setCurrency(event.target.value);
    };

    const [experience, setExperience] = useState('Startup');
    const handleChange2 = (event) => {
        setExperience(event.target.value);
    };

    const [state1, setState1] = useState({
        checkedB: false
    });
    const [state2, setState2] = useState({
        checkedB: false
    });
    const [state3, setState3] = useState({
        checkedB: true
    });
    const handleSwitchChange1 = (event) => {
        setState1({ ...state1, [event.target.name]: event.target.checked });
    };
    const handleSwitchChange2 = (event) => {
        setState2({ ...state2, [event.target.name]: event.target.checked });
    };
    const handleSwitchChange3 = (event) => {
        setState3({ ...state3, [event.target.name]: event.target.checked });
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <p>This is a Bill tab</p>
            </Grid>
         
        </Grid>
    );
};

export default MyAccount;
