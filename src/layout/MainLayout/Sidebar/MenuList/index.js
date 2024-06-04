import { memo } from 'react';
import { useSelector } from 'react-redux';
// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

    const {model} = useSelector((state) => state.assignScreen);

    const navItems = menuItem.items.map((item) => {
        
       if(model.group[0] === "full access" || model.group.includes(item.id)){ switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} accessItem={model.item}/>;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }}
    });

    return <>{navItems}</>;
};

export default memo(MenuList);
