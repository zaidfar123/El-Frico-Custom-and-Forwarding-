import PropTypes from 'prop-types';

// material-ui
import {
    Box,
    Button,
    CardContent,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';

// project imports
import useAuth from 'hooks/useAuth';
import Avatar from 'ui-component/extended/Avatar';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconEdit } from '@tabler/icons';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import PinDropTwoToneIcon from '@mui/icons-material/PinDropTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';

import Avatar3 from 'assets/images/users/avatar-3.png';

// progress
function LinearProgressWithLabel({ value, ...others }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    mr: 1
                }}
            >
                <LinearProgress value={value} {...others} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number
};

// personal details table
/** names Don&apos;t look right */
function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

// ==============================|| PROFILE 1 - PROFILE ||============================== //

const Profile = () => {
    const { user } = useAuth();

    const rows = [
        createData('Full Name', ':', user?.name),
        createData('Fathers Name', ':', 'Mr. Deepen Handgun'),
        createData('Address', ':', 'Street 110-B Kalians Bag, Dewan, M.P. INDIA'),
        createData('Zip Code', ':', '12345'),
        createData('Phone', ':', '+0 123456789 , +0 123456789'),
        createData('Email', ':', 'support@example.com'),
        createData('Website', ':', 'http://example.com')
    ];

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item lg={12} xs={12}>
                <SubCard
                    title={
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar alt="User 1" src={null} />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Typography align="left" variant="subtitle1">
                                    {user?.name}
                                </Typography>
                                <Typography align="left" variant="subtitle2">
                                    {user?.role}
                                </Typography>
                            </Grid>
                        </Grid>
                    }
                >
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItemButton>
                            <ListItemIcon>
                                <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle2" align="right">
                                    {user?.email}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                        <ListItemButton>
                            <ListItemIcon>
                                <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Phone</Typography>} />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle2" align="right">
                                    {user?.phone}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                        <ListItemButton>
                            <ListItemIcon>
                                <PinDropTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Location</Typography>} />
                            <ListItemSecondaryAction>
                                <Typography variant="subtitle2" align="right">
                                    {user?.city}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    </List>
                </SubCard>
            </Grid>
           
        </Grid>
    );
};

export default Profile;
