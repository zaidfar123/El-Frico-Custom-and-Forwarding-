import React, { useState, useEffect } from 'react';
import AxiosServices from "service";
import { Grid, DialogContent, IconButton, Dialog, Button, Tooltip, Chip, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CardMedia, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SubCard from 'ui-component/cards/SubCard';
import useAuth from 'hooks/useAuth';
import { gridSpacing } from 'store/constant';
import utilsJS from "utilsJS";
import CloseIcon from '@mui/icons-material/Close';
import Avatar from 'ui-component/extended/Avatar';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'react-redux';


export default function ExpenseDetailsDialog({ open, handleClose, item }) {

    const theme = useTheme();
    const { user } = useAuth();
    const [list, setList] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const dispatch = useDispatch();

    const getChipColor = (value) => {
        if (value === "Pending by Approver") {
            return "#ff9800"
        }
        else if (value === "Approved") {
            return "#4F8A10"
        }
        else {
            return "#D8000C"
        }
    }

    const getList = () => {
        
        setisLoading(true);
        AxiosServices.getDailyExpenseEmpList(
            {
                fileNo: null,
                pageNumber: 0,
                pageSize: 0,
                userID: item.userID,
                customerID: 0,
                clearingID: item.clearingID
            }
        ).then((res) => {
            let { data, totalCount } = res?.data;

            setisLoading(false);

            if (data) {
                setList(data);
            }
            else {
                setList([]);
            }
        })
    }

    const handleApprove = (row, action) => {

        AxiosServices.approvedRejectExpense(
            [{
                dailyExpenseMapID: row.dailyExpenseMapID,
                userID: user.id,
                approved: action,
                rejected: !action,
                reason: ""
            }]
        ).then((res) => {

            let { message } = res?.data;
            dispatch(
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: message === "Approved successfully." ? "success" : "error"
                    },
                    close: true
                }))

            getList()
        })
    }

    useEffect(() => {
        getList()
    }, [item])

    const isStatusDisabled = (status) =>{
        if(status === "Pending by Approver"){
            return false
        }
        return true
    }

    return (
        <React.Fragment>
            <Dialog
                fullWidth={true}
                maxWidth={"md"}
                open={open}
                onClose={handleClose}
                className={"detail-dialog"}
            >
                <DialogContent style={{ padding: "0px" }}>
                    <Grid container justifyContent="center" spacing={gridSpacing}>
                        <Grid item xs={12} md={12} lg={12}>
                            <SubCard darkTitle title={"Asssigned Expense Details"} secondary={<IconButton
                                aria-label="delete"
                                size="small"
                                onClick={handleClose}
                            >
                                <CloseIcon fontSize="small" color="primary" />
                            </IconButton>}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12}>
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                                    <TableRow>
                                                        <TableCell sx={{ pl: 1 }} align="left">Expense Category</TableCell>
                                                        <TableCell sx={{ pl: 1 }} align="left">Expense Total Amount</TableCell>
                                                        <TableCell sx={{ pl: 1 }} align="left">Attachment</TableCell>
                                                        <TableCell sx={{ pl: 1 }} align="center">Status</TableCell>
                                                        <TableCell align="center">Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {list.length > 0 && list.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell sx={{ pl: 1, pr: 1 }}>
                                                                <Typography align="left" variant="h6">
                                                                    {row.expenseCategoryName}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ pl: 1, pr: 1 }} >
                                                                <Typography align="left" variant="h6">
                                                                    {utilsJS.getFormattedAmount(row.expenseAmountTotal)}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ pl: 1, pr: 1 }} >
                                                                <Avatar src={row.vdPath} variant="rounded"></Avatar>
                                                            </TableCell>
                                                            <TableCell sx={{ pl: 1, pr: 1 }} >
                                                                <Typography align="center" variant="h6">
                                                                    <Chip size="small" label={row.status} style={{ color: getChipColor(row.status), borderColor: getChipColor(row.status), fontSize: "10px" }} variant="outlined" />
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell sx={{ pl: 1, pr: 1 }} align="center">
                                                                <Tooltip title={"Approve"}>
                                                                    <IconButton
                                                                        aria-label="delete"
                                                                        size="small"
                                                                        onClick={() => handleApprove(row, true)}
                                                                        disabled={isStatusDisabled(row.status)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke={isStatusDisabled(row.status) ? "#bbb9b9" : theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                                            <path d="M9 12l2 2l4 -4" />
                                                                        </svg>
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip title={"Reject"}>
                                                                    <IconButton
                                                                        aria-label="delete"
                                                                        size="small"
                                                                        onClick={() => handleApprove(row, false)}
                                                                        disabled={isStatusDisabled(row.status)}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-x" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={isStatusDisabled(row.status) ? "#bbb9b9": "#D8000C"} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                                            <path d="M10 10l4 4m0 -4l-4 4" />
                                                                        </svg>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                    </Grid>
                </DialogContent>

            </Dialog>
        </React.Fragment>
    );
}