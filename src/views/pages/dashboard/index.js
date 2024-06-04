// material-ui
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography, useMediaQuery } from '@mui/material';
import AxiosServices from "service";
import { gridSpacing } from 'store/constant';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CustomDropdowns from "ui-component/CustomDropdowns";
import FilterWrapper from "ui-component/FilterWrapper";
import SeriesCards from "./SeriesCards";
import RoundIconCard from "./RoundIconCard";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardCard from "./Cards"
// ==============================|| ANALYTICS DASHBOARD ||============================== //
const InitalState = {
    fileNo: null,
    customerID: 0,
    startDate: null,
    endDate: null
}
const Analytics = () => {

    const theme = useTheme();

    const [state, setState] = useState(InitalState);
    const [customerStatusList, setCustomerStatusList] = useState([]);
    const [scanningStatusList, setScanningStatusList] = useState([]);
    const [fileStatusList, setFileStatusList] = useState([]);
    const [rFPStatusList, setRFPStatusList] = useState([]);
    const [consigneeStatusList, setConsigneeStatusList] = useState([]);
    const [expenseStatusList, setExpenseStatusList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const requestData = [
        { func: AxiosServices.getCustomerStatus, setStateFunc: setCustomerStatusList },
        { func: AxiosServices.getScanningDocumentationStatus, setStateFunc: setScanningStatusList },
        { func: AxiosServices.getFileStatus, setStateFunc: setFileStatusList },
        { func: AxiosServices.getRFPDashboardStatus, setStateFunc: setRFPStatusList },
        { func: AxiosServices.getConsigneeDashboardStatus, setStateFunc: setConsigneeStatusList },
        { func: AxiosServices.getExpenseStatus, setStateFunc: setExpenseStatusList }
    ];

    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            const requests = requestData.map(({ func, setStateFunc }) => func(state).then(res => {
              const { data } = res?.data;
              setStateFunc(data || []);
            }));
            await Promise.all(requests);
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchData();
      }, [state]);
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <div style={{
                    background: "white",
                    padding: "12px",
                    display: "flex",
                    borderRadius: "6px",
                    gap: "4px",
                    borderColor: theme.palette.mode === 'dark'
                        ? `linear-gradient(210.04deg, ${theme.palette.secondary.dark} -50.94%, rgba(144, 202, 249, 0) 95.49%)`
                        : theme.palette.secondary[800],
                    border: "1px solid"
                }}>
                    <CustomDropdowns
                        filter={state}
                        setFilter={setState}
                        FILTER_={InitalState}
                        customer={5}
                        ocridAD={5}
                        clear={2}
                    />
                </div>
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <DashboardCard col={6} isLoading={isLoading} List={customerStatusList} Icon={PeopleAltIcon} title={"Customer Status"} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <DashboardCard col={6} isLoading={isLoading} List={scanningStatusList} Icon={PeopleAltIcon} title={"Scanning Document Status"} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <DashboardCard col={6} isLoading={isLoading} List={fileStatusList} Icon={PeopleAltIcon} title={"File(s) Status"} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <DashboardCard col={6} isLoading={isLoading} List={rFPStatusList} Icon={PeopleAltIcon} title={"RFP Status"} />
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <DashboardCard col={3} isLoading={isLoading} List={consigneeStatusList} Icon={PeopleAltIcon} title={"Consignee Status"} />
                    </Grid>
                </Grid>
            </Grid> */}
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SeriesCards col={3} isLoading={isLoading} List={consigneeStatusList} Icon={PeopleAltIcon} title={"Consignee Status"} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>

                <RoundIconCard
                    primary="Impressions"
                    secondary="1,563"
                    content="May 23 - June 01 (2018)"
                    iconPrimary={ReceiptLongIcon}
                    color="primary.main"
                    bgcolor="primary.light"
                    List={expenseStatusList}
                    col={4}
                    title={"Expense Status"}
                    isLoading={isLoading}
                />


                {/* <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <DashboardCard col={3} isLoading={false} List={expenseStatusList} Icon={PeopleAltIcon} title={"Expense Status"} />
                    </Grid>
                </Grid> */}
            </Grid>
        </Grid>
    );
};

export default Analytics;
