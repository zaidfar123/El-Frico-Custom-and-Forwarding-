// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TableCell, TableRow, IconButton, Tooltip, Button, Checkbox, Typography } from '@mui/material';
import AxiosServices from "service";
// project imports
import MainCard from 'ui-component/cards/MainCard';
// import ViewDetails from "./ViewDetails";
import { useDispatch } from 'react-redux';
import docuemntImage from "assets/images/document.gif"
import { openLoader } from 'store/slices/loadingModal';
import { IconUserCancel } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import UserDialog from "./CustomerDialog";
import Chip from '@mui/material/Chip';
import { openSnackbar } from 'store/slices/snackbar';
import CustomPagination from "ui-component/Pagination";
import CustomTable from "ui-component/CustomTable";
import settingsgif from "assets/images/settingsgif.gif"

var item = null;
var enableRowCheckbox = true;

export default function CustomerList() {
    const theme = useTheme();
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);

    //Pagination
    const [page, setPage] = useState(1);
    const [count, settotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setisLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [isProcessing, setisProcessing] = useState(false);

    const dispatch = useDispatch();

    const handleLoaderDispatch = (open, description, hasImage) => {
        dispatch(openLoader({
            open: open,
            description: description,
            hasImage: hasImage
        }))
    }
    const handleStatus = (row) => {

        setisProcessing(true);

        let model = {
            flag: !row.isActive,
            id: row.userID
        }
        handleLoaderDispatch(true, "Please wait while we are completing the operations.", settingsgif)

        AxiosServices.deactivateUser([model]).then((res) => {
            let { data, message } = res?.data;

            dispatch(
                openSnackbar({
                    open: true,
                    message: message,
                    variant: 'alert',
                    alert: {
                        color: "success"
                    },
                    close: true
                }))
            getList();
            setisProcessing(false);
            handleLoaderDispatch(false, "", null)

        })
    }

    const handleClose = () => {
        setOpen(false);
        item = null;
        getList()
    }
    const handleOpen = (row) => {
        item = row;
        setOpen(true)
    }
    const getList = () => {
        let model = {
            pageNumber: page,
            pageSize: rowsPerPage,
            customerName: ""
        }

        setisLoading(true);

        AxiosServices.getCustomerList(model).then((res) => {
            let { data, totalCount } = res?.data;
            setisLoading(false)
            if (data) {
                const count = Math.ceil(totalCount / parseInt(rowsPerPage));
                settotalCount(count);
                setList(data);
            }
            else {
                setList([]);
            }
        })
    }

    useEffect(() => {
        getList()
    }, [page, rowsPerPage])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value));
        setPage(1);
    };

    const columnConfig = [
        { name: 'Customer Name', col: 'customerName', caption: false },
        { name: 'Email', col: 'customerEmail', caption: true ,model: "optionalEmailModels" ,object : "optionalEmail"},
        { name: 'Phone', col: 'customerMobileNo', caption: true, model: "optionalMobileModels", object : "optionalMobileNo" },
        { name: 'Address', col: 'customerAddress', caption: false, },
        { name: 'Status', col: 'isActive', caption: false },
    ];

    const getTableRow = () => {
        return list.map((row, rowIndex) => (
            <TableRow hover key={rowIndex}>
                {enableRowCheckbox && (
                    <TableCell padding="checkbox">
                        <Checkbox />
                    </TableCell>
                )}
                {columnConfig.map((column, colIndex) => (
                    <TableCell key={colIndex} align="left">
                        {column.col === "isActive" ?
                            <Chip size="small" variant="outlined" style={{ color: row[column.col] ? "green" : "red", borderColor: row[column.col] ? "green" : "red" }} label={row[column.col] ? "Active" : "Inactive"} />
                            :

                            <div style={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                <Typography variant="h6" >
                                    {row[column.col]}
                                </Typography>
                                {column.caption &&
                                    <Typography variant="caption">
                                        {row[column.model].reduce((acc, obj) => acc + (acc ? ', ' : '') + obj[column.object], '')}
                                    </Typography>}
                            </div>

                        }
                    </TableCell>
                ))}
                <TableCell sx={{ pr: 1 , width: 150}} align="center">
                <Tooltip title={"Edit Customer"}>
                        <IconButton disabled={isProcessing} aria-label="delete" size="small" onClick={() => handleOpen(row)}>
                            {<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-edit" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                                <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                            </svg>
                           }
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={row.isActive ? "Disable Customer" : "Activate Customer"}>
                        <IconButton disabled={isProcessing} aria-label="delete" size="small" onClick={() => handleStatus(row)}>
                            {row.isActive ? <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-cancel" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                                <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                                <path d="M17 21l4 -4" />
                            </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-check" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00b341" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4" />
                                    <path d="M15 19l2 2l4 -4" />
                                </svg>}
                        </IconButton>
                    </Tooltip>
                </TableCell>
            </TableRow>
        ))
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Button
                    onClick={() => setOpen(true)}
                    variant="contained"
                    style={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}
                >Add Customer</Button>
            </Grid>
            <Grid item xs={12}>
                <MainCard
                    content={false}
                    title="Customer List"
                    secondary={null}
                >
                    {/* table */}
                    <CustomTable
                        headers={columnConfig}
                        hasAction={true}
                        enableRowCheckbox={enableRowCheckbox}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                    >
                        {getTableRow()}
                    </CustomTable>

                    <CustomPagination
                        list={list}
                        count={count}
                        rowsPerPage={rowsPerPage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        handleChangePage={handleChangePage}
                        page={page}
                        isLoading={isLoading} />
                </MainCard>
            </Grid>
            {open && <UserDialog open={open} handleClose={handleClose} item={item} getList={getList} />}
        </Grid>
    );
}
