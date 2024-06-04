import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, List, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcons from "./MenuIcons";
// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //
let PREVIOUS_GROUP = "";
const NavGroup = ({ item, accessItem }) => {
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const { pathname } = useLocation();

    const handleClick = (id) => {

        if (id !== false) {
            if (PREVIOUS_GROUP !== id) {
                setOpen(!open);
                setSelected(selected ? id : null);
                PREVIOUS_GROUP = id
            }
        }
    };

    useEffect(() => {
        const childrens = item.children ? item.children : [];
        childrens.forEach((i) => {
            if (i.url === pathname) {
                setOpen(true);
                setSelected(item.id)
                PREVIOUS_GROUP = item.id
            }
        });
    }, []);

    // menu list collapse & items
    const items = item.children?.map((menu) => {

        if (accessItem[0] === "full access" || accessItem.includes(menu.url)) {
            switch (menu.type) {
                case 'collapse':
                    return <NavCollapse key={menu.id} menu={menu} level={1} />;
                case 'item':
                    return <NavItem key={menu.id} item={menu} level={1} />;
                default:
                    return (
                        <Typography key={menu.id} variant="h6" color="error" align="center">
                            Menu Items Error
                        </Typography>
                    );
            }
        }
    });

    return (
        <>
            <div>
                {/* <Accordion expanded={selected === item.id && open ? true : false} onClick={() => handleClick(item.id)} style={{ background: "#1b1a19", borderRadius: "12px", marginBottom: "18px" }}> */}
                <Accordion style={{ borderRadius: "6px", marginBottom: "6px" }}>
                    <AccordionSummary
                        style={{ minHeight: "60x", padding: "0px 10px", color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}
                        expandIcon={<ExpandMoreIcon style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <div style={{ marginRight: "8px", width: "20px", height: "20px" }}><MenuIcons id={item.id} /></div>
                        <Typography style={{ fontSize: "12px", fontWeight: "500", lineHeight: "1.8em" }}>{item.title}</Typography>
                    </AccordionSummary>

                    <List>{items}</List>
                </Accordion>
            </div>
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;
