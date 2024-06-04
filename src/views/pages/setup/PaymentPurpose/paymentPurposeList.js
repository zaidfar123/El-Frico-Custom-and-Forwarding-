// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TableCell, TableRow, IconButton, Tooltip, Button, Checkbox } from '@mui/material';
import AxiosServices from "service";
// project imports
import MainCard from 'ui-component/cards/MainCard';
// import ViewDetails from "./ViewDetails";
import { useDispatch } from 'react-redux';
import docuemntImage from "assets/images/document.gif"
import { openLoader } from 'store/slices/loadingModal';
import { IconUserCancel } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import PaymentPurposeDialog from "./paymentPurposeDialog";
import Chip from '@mui/material/Chip';
import { openSnackbar } from 'store/slices/snackbar';
import CustomPagination from "ui-component/Pagination";
import CustomTable from "ui-component/CustomTable";
import EditIcon from '@mui/icons-material/Edit';

var item = null;
var enableRowCheckbox = true;

export default function paymentPurposeList() {
    const theme = useTheme();
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);

    //Pagination
    const [page, setPage] = useState(1);
    const [count, settotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setisLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const dispatch = useDispatch();

    const handleStatus = (row) => {

        let model = {
            isActive: !row.isActive,
            ppid: row.ppid
        }

        AxiosServices.deActivatedPaymentPurpose([model]).then((res) => {
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

        })
    }

    const handleClose = () => {
        setOpen(false);
        item = null;
    }
    const getList = () => {
        let model = {
            pageNumber: page,
            pageSize: rowsPerPage,
            requestString: ""
        }

        setisLoading(true);

        AxiosServices.getPaymentPurposeList(model).then((res) => {
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
    const handleEdit = (row) => {
        item = row;
        setOpen(true)
    };

    const columnConfig = [
        { name: 'Payment Purpose', col: 'paymentPurpose' },
        { name: 'Status', col: 'isActive' },
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
                            row[column.col]}
                    </TableCell>
                ))}
                <TableCell sx={{ pr: 3 }} align="center">
                    <Tooltip title={"Edit"}>
                        <IconButton aria-label="delete" size="small" onClick={() => handleEdit(row)}>
                            <EditIcon color="secondary" size="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={row.isActive ? "Disable" : "Enable"}>
                        <IconButton aria-label="delete" size="small" onClick={() => handleStatus(row)}>
                            {row.isActive ? <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff4500" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 7l16 0" />
                                <path d="M10 11l0 6" />
                                <path d="M14 11l0 6" />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash-off" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00b341" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M3 3l18 18" />
                                    <path d="M4 7h3m4 0h9" />
                                    <path d="M10 11l0 6" />
                                    <path d="M14 14l0 3" />
                                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l.077 -.923" />
                                    <path d="M18.384 14.373l.616 -7.373" />
                                    <path d="M9 5v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
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
                >Add Payment Purpose</Button>
            </Grid>
            <Grid item xs={12}>
                <MainCard
                    content={false}
                    title="Payment Purpose List"
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
            {open && <PaymentPurposeDialog open={open} handleClose={handleClose} item={item} getList={getList} />}
        </Grid>
    );
}
