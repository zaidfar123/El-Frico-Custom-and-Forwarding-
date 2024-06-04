import React, { useState, useEffect } from 'react';
import { Grid, DialogTitle, DialogContent, DialogActions, Dialog, Button, TextField } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import AxiosService from "service";
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import NumberFormat from 'react-number-format';
import MainCard from 'ui-component/cards/MainCard';
import menuItem from 'menu-items';
import CustomSelect from 'ui-component/CustomSelect';

export default function UserAssignmentScreen() {

    const theme = useTheme();
    const dispatch = useDispatch();
    const [state, setState] = useState({
        role_ID : 0
    })
    const [roleList, setroleList] = useState([])
    const [error, setError] = useState({})

    const handleChange = (event) =>{
        const { name , value} = event.target;
        setState({...state, [name] : value})
    }

    const getroleList = () =>{

        AxiosService.getRoles().then((res) => {
            let { data, message } = res?.data;
            setroleList(data)
        })
    }

    useEffect(() => {
        getroleList()
    }, [])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <MainCard content={true} title="Assign Screen" secondary={null}>   
                    
                    <Grid item={12}>
                    <CustomSelect
                        generateList={false}
                        label={"Role"}
                        onChange={handleChange}
                        size="small"
                        name={"role_ID"}
                        InputLabelProps={{ shrink: true }}
                        state={state}
                        disabled={false}
                        setState={setState}
                        isInt={true}
                        error={error}
                        options={roleList.map((item) => ({
                            value: item.role_ID,
                            label: item.roleName,
                        }))}
                    />
                    </Grid>
                    
                    <Grid item={12}>

                    </Grid>
        
                </MainCard>
            </Grid>
        </Grid>
    )

}