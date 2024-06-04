import * as React from 'react';
import {useTheme, styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    [`& .${toggleButtonGroupClasses.grouped}`]: {
        margin: theme.spacing(0.5),
        border: 0,
        borderRadius: theme.shape.borderRadius,
        [`&.${toggleButtonGroupClasses.disabled}`]: {
            border: 0,
        },
    },
    [`& .${toggleButtonGroupClasses.middleButton},& .${toggleButtonGroupClasses.lastButton}`]:
    {
        marginLeft: -1,
        borderLeft: '1px solid transparent',
    },
}));

export default function CustomToggleButton({buttons,setSelected, selected}) {
    
    const theme = useTheme();

    const handleAlignment = (event) => {
        let {value} = event.target;
       
        setSelected(value);
    };

    return (
        <div>
            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    flexWrap: 'wrap',
                }}
            >
                <ToggleButtonGroup
                    size="small"
                    value={selected}
                    exclusive
                    onClick={handleAlignment}
                    aria-label="text alignment"
                >
                    {
                        buttons.map((title) => {
                            return (
                                <>
                                    <ToggleButton 
                                    style={{
                                        width: "200px",
                                        background : selected === title ? theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light : "transparent",
                                        borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
                                    }} 
                                    value={title} 
                                    aria-label="left aligned">
                                        {title}
                                    </ToggleButton>

                                    {/* <Divider flexItem orientation="vertical" sx={{ mx: 0.5, my: 1 }} /> */}
                                </>

                            )
                        })
                    }

                </ToggleButtonGroup>
            </Paper>
        </div>
    );
}
