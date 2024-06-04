import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Tab, Tabs } from '@mui/material';

// project imports
import ClearingAgency from './ClearingAgency';
import CustomDuty from './CustomDuty';
import MyAccount from './MyAccount';
import ConversionRate from './ConversionRate';
import Settings from './Settings';
import ReimbursementCategory from './ReimbursementCategory';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import SettingsIcon from '@mui/icons-material/Settings';
import CalculateIcon from '@mui/icons-material/Calculate';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PaymentsIcon from '@mui/icons-material/Payments';
// tabs panel
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// tabs option
const tabsOption = [
    // {
    //     label: 'Agency',
    //     icon: <SettingsIcon sx={{ fontSize: '1.3rem' }} />
    // },
    {
        label: 'Custom Duty',
        icon: <CalculateIcon sx={{ fontSize: '1.3rem' }} />
    },
    // {
    //     label: 'Bill',
    //     icon: <LibraryBooksTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    // },
    {
        label: 'Conversion Rate',
        icon: <CurrencyExchangeIcon sx={{ fontSize: '1.3rem' }} />
    },
    // {
    //     label: 'Reimburesment Amount',
    //     icon: <PaymentsIcon sx={{ fontSize: '1.3rem' }} />
    // },
    // {
    //     label: 'Settings',
    //     icon: <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
    // }
];

// ==============================|| PROFILE 1 ||============================== //

const Configuration = () => {
    const theme = useTheme();

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Tabs
                        value={value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleChange}
                        aria-label="simple tabs example"
                        variant="scrollable"
                        sx={{
                            mb: 3,
                            '& a': {
                                minHeight: 'auto',
                                minWidth: 10,
                                py: 1.5,
                                px: 1,
                                mr: 2.25,
                                color: theme.palette.grey[600],
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            '& a.Mui-selected': {
                                color: theme.palette.primary.main
                            },
                            '& .MuiTabs-indicator': {
                                bottom: 2
                            },
                            '& a > svg': {
                                marginBottom: '0px !important',
                                mr: 1.25
                            }
                        }}
                    >
                        {tabsOption.map((tab, index) => (
                            <Tab key={index} component={Link} to="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                    {/* <TabPanel value={value} index={0}>
                        <ClearingAgency />
                    </TabPanel> */}
                    <TabPanel value={value} index={0}>
                        <CustomDuty />
                    </TabPanel>
                    {/* <TabPanel value={value} index={2}>
                        <MyAccount />
                    </TabPanel> */}
                    <TabPanel value={value} index={1}>
                        <ConversionRate />
                    </TabPanel>
                    {/* <TabPanel value={value} index={4}>
                        <ReimbursementCategory />
                    </TabPanel> */}
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Configuration;
