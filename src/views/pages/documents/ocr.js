import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Grid, Card, CardActions, CardContent, TextField, Button, MenuItem, Typography, Tooltip, IconButton } from '@mui/material';
import AxiosServices from "service";
import OCRDialoge from './OCRDialoge';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { openLoader } from 'store/slices/loadingModal';
import { useSelector, useDispatch } from 'react-redux';
import scannerImage from "assets/images/scanner.gif";
import CardSkeleton from "ui-component/CardSkeleton";
import CustomPagination from 'ui-component/PaginationCard';
import SubCard from 'ui-component/cards/SubCard';
import AutoComplete from 'ui-component/AutoComplete';
import CustomDropdowns from "ui-component/CustomDropdowns";
import FilterWrapper from "ui-component/FilterWrapper";

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-input.Mui-disabled': {
        background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
        "-webkit-text-fill-color": `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`
    },
}));

var Base64Image = [];
var PDF = null;
var ocrid = null;
var ocrData = null;

const initialState = {
    customTypeID: 1,
    customerID: 0,
    fileNo: "",
    ocrid: 0
}

const OcrDocument = () => {

    const theme = useTheme();
    const [list, setList] = useState([]);
    const [state, setState] = useState(initialState);
    const [AgencyList, setAgencyList] = useState([]);
    const [open, setOpen] = useState(false);
    const [disable, setDisable] = useState(false);
    const dispatch = useDispatch();
    const [error, setError] = useState({})
    const [isClear, setisClear] = useState(false);

    //Pagination
    const [page, setPage] = useState(1);
    const [count, settotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(8);
    const [isLoading, setisLoading] = useState(false);

    const handleLoaderDispatch = (open, description, hasImage) => {
        dispatch(openLoader({
            open: open,
            description: description,
            hasImage: hasImage
        }))
    }

    const handleClickOpenDialog = (item) => {

        handleLoaderDispatch(true, "Please wait while we are scanning the documents", scannerImage)
        Base64Image = [];
        ocrid = item.ocrid
        setDisable(true)
        item.oCR_RequestModels.map((url, index) => {

            Base64Image.push(url.vdPath)
            if (index === item.oCR_RequestModels.length - 1) {
                GetfileDetailforClearing(ocrid)
            }

        })
    };

    const handleCloseDialog = () => {
        setOpen(false);
        GetList()
    };
    
    const OnCompleteOCRoperation = () => {
        setOpen(true);
        setDisable(false)
        handleLoaderDispatch(false, "", null)
    };

    const GetList = () => {

        setisLoading(true);

        let model = {
            pagenumber: page,
            pageSize: rowsPerPage,
            id: state.ocrid,
            customTypeID: state.customTypeID,
            customerID: state.customerID
        }

        AxiosServices.getOCR_FileList(model).then((res) => {
            setisLoading(false);
            let { data, totalCount } = res?.data;
            if (data) {
                const count = Math.ceil(totalCount / parseInt(rowsPerPage));
                settotalCount(count);
                setList(data)
            }
            else {
                setList([])
            }
        })
    }

    const GetfileDetailforClearing = (id) => {

        AxiosServices.getfileDetailforClearing({ id }).then((res) => {
            let { data, message } = res?.data;
            if (data) {
                ocrData = data
            }
            else {
                ocrData = null;
            }
            OnCompleteOCRoperation()
        })
    }


    useEffect(() => {
        setList([])
        GetList()
    }, [rowsPerPage, page, state]);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <>
            <p style={{
                marginTop: 0,
                marginLeft: "6px",
                fontSize: "16px",
                color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
                fontWeight: 500,

            }}>Scanning Document</p>


            <FilterWrapper title="Filter" >
                <CustomDropdowns
                    filter={state}
                    setFilter={setState}
                    FILTER_={initialState}
                    customer={5}
                    ocrid={5}
                    isClearFromParent={true}
                    setisClear={setisClear}
                    clear={2}
                />
            </FilterWrapper>

            {!isLoading && list.length > 0 && <div style={{ height: "100vh", overflowY: "auto" }}>
                <Grid container spacing={2}>
                    {list.map((item, index) => {
                        return (
                            <Grid key={index} item xs={12} sm={4} md={4} lg={3}>
                                <Card sx={{ maxWidth: 345, border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}` }}>
                                    <CardContent style={{ padding: 0 }}>
                                        <Carousel>
                                            {item.oCR_RequestModels.map(img => (
                                                <div>
                                                    <img src={img.vdPath} />
                                                </div>
                                            ))
                                            }
                                        </Carousel>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: "space-between", padding: "12px" }}>
                                        <Typography variant="h6">
                                            {item.fileNo}
                                        </Typography>
                                        <Tooltip title="Start Scanning">
                                            <IconButton
                                                disabled={disable}
                                                onClick={() => handleClickOpenDialog(item)}
                                                size="small"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-narrow-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M5 12l14 0" />
                                                    <path d="M15 16l4 -4" />
                                                    <path d="M15 8l4 4" />
                                                </svg>
                                            </IconButton>
                                        </Tooltip>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )

                    })
                    }
                </Grid>
                {open && <OCRDialoge PDF={PDF} GetList={GetList} ocrData={ocrData} open={open} Base64Image={Base64Image} AgencyList={AgencyList} ocrid={ocrid} handleClose={setOpen} />}
            </div>
            }
            {/* Pagination */}

            <CustomPagination
                list={list}
                count={count}
                handleChangePage={handleChangePage}
                page={page}
                isLoading={isLoading}
            />

        </>
    );
};

export default OcrDocument;
