import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';
import LogoBlue from "assets/images/LogoBlue.png"

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <Link component={RouterLink} to={DASHBOARD_PATH}>
        {/* <Logo /> */}
        <img src={LogoBlue} style={{ width: '150px', height: "50px" }} />
    </Link>
);

export default LogoSection;
