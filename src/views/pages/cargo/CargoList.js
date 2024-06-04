// material-ui
import React, { useState, useEffect } from "react";
import { Grid, TableCell, TableRow, IconButton, Tooltip, Checkbox, Typography, Badge,Collapse ,Box,TableHead,TableBody,Table } from '@mui/material';
import AxiosServices from "service";
// project imports
import MainCard from 'ui-component/cards/MainCard';
// import ViewDetails from "./ViewDetails";
import { useDispatch } from 'react-redux';
import docuemntImage from "assets/images/document.gif"
import { openLoader } from 'store/slices/loadingModal';
import { IconFileDownload } from '@tabler/icons';
import CustomPagination from "ui-component/Pagination";
import CustomTable from "ui-component/CustomTable";
import utilsJS from "utilsJS";
// import ClearanceFilter from "./ClearanceFilter";
import FilterListIcon from '@mui/icons-material/FilterList';
import ApprovalButtons from "../approvals";
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import { useTheme, styled } from '@mui/material/styles';
import ViewImage from "../field_team/ViewImage";
import { saveAs } from 'file-saver'; // v2.0.5
import FIleUploadDialog from "./FIleUploadDialog";
import CustomDropdowns from "ui-component/CustomDropdowns";
import FilterWrapper from "ui-component/FilterWrapper";

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
        color: "white",
        fontSize: "10px"

    },
}));

var IMAGES_LIST = [];
var ROW_DETAILS = null;
var TITLE = "";
var enableRowCheckbox = false;
var OCR_ID = 0;

var FILTER_ = {
    fileNo: "",
    pageNumber: 0,
    pageSize: 0,
    billOfLading: "",
    vessel: "",
    voyNo: "",
    customerID: 0,

    shipmentTypeDetailID: 0,
    shipmentTypeID: 0,
    collectorateID: 0,
    terminalID: 0,
    itemCategoryID: 0,
    cargoTypeDetailID: 0,
    cargoTypeID: 0
}

export default function CargoList() {

    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [openUploader, setopenUploader] = useState(false);
    const [isProcessing, setisProcessing] = useState(false);
    const [filter, setFilter] = useState(FILTER_);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const dispatch = useDispatch();
    const theme = useTheme();
    const { user } = useAuth();
    const [isClear, setisClear] = useState(false);

    //Pagination
    const [page, setPage] = useState(1);
    const [count, settotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setisLoading] = useState(false);

    const handleLoaderDispatch = (open, description, hasImage) => {
        dispatch(openLoader({
            open: open,
            description: description,
            hasImage: hasImage
        }))
    }

    const handleClose = () => {
        setOpen(false);
        IMAGES_LIST = [];
    }
    const handleUploadClose = () => {
        setopenUploader(false);
        getList()
    }
    const handleOpenUploader = (ocrID) => {
        OCR_ID = ocrID;
        setopenUploader(true);
    }

    const getList = () => {

        setisLoading(true);
        AxiosServices.getFieldList({
            ...filter,
            pageNumber: page,
            pageSize: rowsPerPage,
            fileNo: filter.fileNo === "" ? null : filter.fileNo,
            billOfLading: filter.billOfLading === "" ? null : filter.billOfLading,
            vessel: filter.vessel === "" ? null : filter.vessel,
            voyNo: filter.voyNo === "" ? null : filter.voyNo,
        }).then((res) => {
            let { data, totalCount } = res?.data;
            
            setisLoading(false);

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
    }, [page, rowsPerPage, filter])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value));
        setPage(1);
    };

    const columnConfig = [
        { name: 'File No', col: 'fileNo', upload: false, download: false, width: 100, hasImageIcon: false },
        { name: 'Customer', col: 'customerName', upload: false, download: false, width: 220, hasImageIcon: false },
        { name: 'Bill of Lading', col: 'billOfLading', upload: false, download: false, width: 140, hasImageIcon: false },
        { name: 'Vessel', col: 'vessel', upload: false, download: false, width: 130, hasImageIcon: false },
        { name: 'PDF', col: 'uploadedDoc', upload: false, download: true, width: 50, hasImageIcon: false, },
        { name: 'Uploaded File', col: 'uploadedDoc', upload: false, download: false, width: 130, hasImageIcon: true, },
        { name: 'Expense File', col: 'userExpenseModels', upload: false, download: false, width: 130, hasImageIcon: true, },
        { name: 'Cargo File', col: 'cargoUserDetails', upload: true, download: false, width: 100, hasImageIcon: true, },
        // { name: 'Field File', col: 'fieldUserDetails', download : false, width: 100, hasImageIcon: true, },
        // Add more columns as needed...
    ];

    const getBadgeCount = (model, col) => {

        let count = 0;

        if (col === "cargoUserDetails" || col === "userExpenseModels" || col === "fieldUserDetails") {

            if (model.length === 0) {
                return model.length;
            }
            else {
                if (col === "userExpenseModels") {
                    model.map((item, i) => {
                        count = count + item.expenseDocs.length;
                    })
                }
                else {
                    model.map((item, i) => {
                        count = count + item.otherDocPaths.length;
                    })
                }
            }
        }
        else {
            count = model.docImages.length
        }

        return count;
    }

    const downloadPDF = async (FileNo, pdfUrl) => {

        handleLoaderDispatch(true, "Please wait while we are downloading your file.", docuemntImage);
        setisProcessing(true);
        try {
            AxiosServices.getFileByURL(pdfUrl).then((response) => {
                
                saveAs(response.data, FileNo + ".pdf")
                handleLoaderDispatch(false, "", null)
                setisProcessing(false);
            });
        }
        catch (error) {
            console.error('Error downloading PDF:', error);
            handleLoaderDispatch(false, "", null)
            setisProcessing(false);
        }

    }

    const toggleRow = (rowIndex) => {

        // Update the 'list' array by finding the row at the given 'rowIndex' and modifying its 'webocRemarks'
        const updatedList = list.map((row, index) => {
            if (index === rowIndex) {
                if (typeof (row.isOpen) === "undefined") {
                    return { ...row, isOpen: true };
                }
                else {
                    return { ...row, isOpen: !row.isOpen };
                }
            }
            return row;
        });

        setList(updatedList);
    };

    const getTableRow = () => {
        return list.map((row, rowIndex) => {
            const isItemSelected = isSelected(row.clearingID);
            
            return (
                <React.Fragment>
                    <TableRow key={rowIndex} hover>
                        {enableRowCheckbox && (
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    // indeterminate={selectedRows.length > 0 && selectedRows.length < list.length}
                                    checked={isItemSelected}
                                    onChange={(event) => handleRowClick(event, row)}
                                    disabled={!ApprovalButtons.isEnabled(row.rfpStatus)}
                                />
                            </TableCell>
                        )}
                        {columnConfig.map((column, colIndex) => (
                            column.hasImageIcon ?
                                <TableCell key={colIndex} align="center">
                                    <div style={{ display: 'flex', gap: "12px", flexDirection: "row", justifyContent: "center" }}>
                                        <Tooltip title={"View " + column.name}>
                                            <StyledBadge badgeContent={getBadgeCount(row[column.col], column.col)} color="success" showZero>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    disabled={getBadgeCount(row[column.col], column.col) === 0}
                                                    onClick={() => handleViewImage(row, column.col, column.name)}
                                                >
                                                    {getImageIcon(getBadgeCount(row[column.col], column.col) === 0 ? "no-image" : "image")}
                                                </IconButton>
                                            </StyledBadge>
                                        </Tooltip>
                                        {column.upload &&
                                            <Tooltip title={"Upload Files"}>
                                                <IconButton
                                                    aria-label="delete"
                                                    size="small"
                                                    disabled={isProcessing}
                                                    onClick={() => handleOpenUploader(row.ocrid)}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cloud-upload" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                                                        <path d="M9 15l3 -3l3 3" />
                                                        <path d="M12 12l0 9" />
                                                    </svg>
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </div>
                                </TableCell> :
                                column.download ?
                                    <TableCell key={colIndex} align="left">
                                        <Tooltip title={"Download PDF"}>
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                disabled={isProcessing}
                                                onClick={() => downloadPDF(row.fileNo, row[column.col].combinePDFs[0].uploadedDocPDFVDPath)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                                    <path d="M7 11l5 5l5 -5" />
                                                    <path d="M12 4l0 12" />
                                                </svg>
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell> :
                                    <TableCell key={colIndex} align="left">
                                        <Typography variant="h6">
                                            {row[column.col]}
                                        </Typography>
                                    </TableCell>
                        ))}
                        <TableCell sx={{ pr: 2 }} align="center">

                            {typeof (row.isOpen) === "undefined" || !row.isOpen ?

                                <Tooltip title={"Show Details"}>
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => toggleRow(rowIndex)}
                                    >

                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-plus" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                            <path d="M9 12h6" />
                                            <path d="M12 9v6" />
                                        </svg>
                                    </IconButton>
                                </Tooltip>
                                :
                                <Tooltip title={"Hide Details"}>
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() => toggleRow(rowIndex)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-minus" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                            <path d="M9 12l6 0" />
                                        </svg>
                                    </IconButton>
                                </Tooltip>
                            }
                        </TableCell>
                    </TableRow>
                    <CollapseRow key={rowIndex} row={row} theme={theme} setOpen={toggleRow} rowIndex={rowIndex} />
                </React.Fragment>
            );
        });
    };

    const handleRowClick = (event, row) => {

        let name = row.clearingID
        
        const selectedIndex = selectedRows.indexOf(name);
        let newSelectedRows = [];

        if (selectedIndex === -1) {
            newSelectedRows = newSelectedRows.concat(selectedRows, name);
        } else if (selectedIndex === 0) {
            newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedRows = newSelectedRows.concat(
                selectedRows.slice(0, selectedIndex),
                selectedRows.slice(selectedIndex + 1)
            );
        }

        setSelectedRows(newSelectedRows);
        setSelectAll(newSelectedRows.length === list.length);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {

            const newSelectedId = list
                .filter(obj => ApprovalButtons.isEnabled(obj.rfpStatus))
                .map(obj => obj.clearingID);

            setSelectedRows(newSelectedId)
            setSelectAll(newSelectedId.length);
            return;
        }
        else {
            setSelectedRows([])
            setSelectAll(false);
        }
    };

    const isSelected = (name) => selectedRows.indexOf(name) !== -1;

    const getImageIcon = (show) => {
        return (

            show === "image" ? <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-photo-search" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M15 8h.01" />
                <path d="M11.5 21h-5.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v5.5" />
                <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M20.2 20.2l1.8 1.8" />
                <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l2 2" />
            </svg> :
                show === "no-image" ?
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-photo-x" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15 8h.01" />
                        <path d="M13 21h-7a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v7" />
                        <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l3 3" />
                        <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0" />
                        <path d="M22 22l-5 -5" />
                        <path d="M17 22l5 -5" />
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-printer" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                        <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                        <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                    </svg>

        )
    }

    const handleViewImage = (model, col, title) => {

        ROW_DETAILS = {
            fileNo: model.fileNo,
            billOfLading: model.billOfLading,
            vessel: model.vessel,
            voyNo: model.voyNo,
            customerName: model.customerName,
        }
        
        if (col === "cargoUserDetails" || col === "userExpenseModels" || col === "fieldUserDetails") {

            if (col === "userExpenseModels") {
                model[col].map((item, i) => {
                    item.expenseDocs.map((doc) => {
                        IMAGES_LIST.push({
                            source: doc.expenseDocVDPath,
                            date: doc.expenseDate,
                            name: doc.expenseCategoryName,
                            username: item.userDetailName
                        })
                    })
                })
            }
            else {
                model[col].map((item, i) => {
                    item.otherDocPaths.map((doc) => {
                        IMAGES_LIST.push({
                            source: doc.othersDocVDPath,
                            date: doc.otherDocDate,
                            name: null,
                            username: item.othersDocUser
                        })
                    })
                })
            }

        }
        else {

            model[col].docImages.map((doc, i) => {

                IMAGES_LIST.push({
                    source: doc.uploadedDocImagesVDPath,
                    date: doc.docUploadedDate,
                    name: null,
                    username: null

                })
            })

        }

        TITLE = title
        console.log(IMAGES_LIST)
        setOpen(true)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
            <FilterWrapper title="Filter" >
                    <CustomDropdowns
                        filter={filter}
                        setFilter={setFilter}
                        FILTER_={FILTER_}
                        customer={6}
                        fileno={6}
                        billoflading={3}
                        vessel={3}
                        voy={3}
                        clear={3}
                        isClearFromParent={true}
                        setisClear={setisClear}
                    />
                </FilterWrapper>
                <MainCard
                    content={false}
                    title="Cargo List"
                    secondary={<></>}
                >

                    <CustomTable
                        headers={columnConfig}
                        hasAction={true}
                        enableRowCheckbox={enableRowCheckbox}
                        selectedRows={selectedRows}
                        setSelectedRows={setSelectedRows}
                        selectAll={selectAll}
                        setSelectAll={setSelectAll}
                        handleSelectAllClick={handleSelectAllClick}
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
            {open && <ViewImage open={open} handleClose={handleClose} IMAGES_LIST={IMAGES_LIST} title={TITLE} ROW_DETAILS={ROW_DETAILS} />}
            {openUploader && <FIleUploadDialog open={openUploader} handleClose={handleUploadClose} userID={user.id} ocrID={OCR_ID} />}
        </Grid>
    );
}

function CollapseRow(props) {
    const { row, theme, rowIndex, setOpen, key } = props;

    
    return (
        <TableRow sx={{ fontSize: "11px", padding: "10px" }} onClick={() => setOpen(rowIndex)}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, overflowX: 'auto' }} colSpan={12}>
                <Collapse in={typeof (row.isOpen) === "undefined" ? false : row.isOpen} timeout="auto" unmountOnExit>
                    <div style={{ overflowX: 'auto' }}>
                        <Box sx={{ margin: 1, padding: "6px", border: "1px solid", borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark, borderRadius: "4px" }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Shipment Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead sx={{ backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light }}>
                                    <TableRow>
                                        {/* <TableCell sx={{ pl: 3 }}>S No.</TableCell> */}
                                        {/* <TableCell style={{ minWidth: 130 }} align="left">Shipment Type</TableCell> */}
                                        <TableCell style={{ minWidth: 150 }} align="left">Shipment Details</TableCell>
                                        {/* <TableCell style={{ minWidth: 190 }} align="left">Shipment Type Details</TableCell> */}
                                        {/* <TableCell style={{ minWidth: 130 }} align="left">Cargo Type</TableCell> */}
                                        <TableCell style={{ minWidth: 130 }} align="left">Cargo Details</TableCell>
                                        {/* <TableCell style={{ minWidth: 150 }} align="left">Cargo Type Details</TableCell> */}
                                        <TableCell style={{ minWidth: 80 }} align="left">Count</TableCell>
                                        <TableCell style={{ minWidth: 130 }} align="left">Item Category</TableCell>
                                        <TableCell style={{ minWidth: 100 }} align="left">Terminal</TableCell>
                                        <TableCell style={{ minWidth: 100 }} align="left">Collectorate</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.shippingCargoResponses.map((catRow, index) => (
                                        <TableRow hover key={index}>
                                            {/* <TableCell sx={{ pl: 3 }} component="th" scope="row"> {index + 1}</TableCell> */}
                                            {/* <TableCell style={{ minWidth: 90 }} align="left">{catRow.shipmentTypeName}</TableCell> */}
                                            <TableCell style={{ minWidth: 90 }} align="left">
                                                <div style={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                                    <Typography variant="h6" >
                                                        {catRow.shipmentTypeName}
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        {catRow.shipmentTypeDetailName}
                                                    </Typography>
                                                </div>
                                            </TableCell>

                                            <TableCell style={{ minWidth: 90 }} align="left">
                                                <div style={{ display: 'flex', flexDirection: "column", gap: "4px" }}>
                                                    <Typography variant="h6" >
                                                        {catRow.cargoTypeName}
                                                    </Typography>
                                                    <Typography variant="caption">
                                                        {catRow.cargoTypeDetailName}
                                                    </Typography>
                                                </div>
                                            </TableCell>
                                            {/* <TableCell style={{ minWidth: 80 }} align="left">{catRow.shipmentTypeDetailName}</TableCell> */}
                                            {/* <TableCell style={{ minWidth: 80 }} align="left">{catRow.cargoTypeName}</TableCell>
                                        <TableCell style={{ minWidth: 100 }} align="left">{catRow.cargoTypeDetailName}</TableCell> */}
                                            <TableCell style={{ minWidth: 40 }} align="left">
                                                <Typography variant="h6" >
                                                    {catRow.count}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 100 }} align="left">
                                                <Typography variant="h6" >
                                                    {catRow.itemCategoryName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 130 }} align="left">
                                                <Typography variant="h6" >
                                                    {catRow.terminalName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell style={{ minWidth: 180 }} align="left">
                                                <Typography variant="h6" >
                                                    {catRow.collectorateName}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </div>
                </Collapse>
            </TableCell>
        </TableRow>
    );
}