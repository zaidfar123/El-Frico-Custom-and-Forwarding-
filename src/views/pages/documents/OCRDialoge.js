import React, { useEffect, useState, useRef } from 'react';
import { Grid, Dialog, AppBar, Slide, TextField, Button, Toolbar, Tooltip, IconButton } from '@mui/material';
import { createWorker } from 'tesseract.js';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
// project imports
import FieldsDialog from "./fieldsDialog";
import AxiosServices from "service";
import { openSnackbar } from 'store/slices/snackbar';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme, styled } from '@mui/material/styles';
import { clearingProduct, clearingAgency, clearingForm,shipmentDetails } from "validation"
import OCR_Loader from "./OCR_Loader";
import ClearingDrawer from "./Drawer";
import MenuIcon from '@mui/icons-material/Menu';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyleIconButton = styled(IconButton)(({ theme }) => ({

  background: `${theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.secondary.light}!important`,
  color: `${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}!important`

}));

const InitialState = {
  billOfLading: "",
  vessel: "",
  consignee: "",
  ocrid: 0,
  voyNo: "",
  portofLoading: "",
  portofDischarge: "",
  InvoiceNo: "",
  freightForward: "",
  shippingLine: "",
  shippingTerm: "",
  shipperName: "",
  freightTerm: "",
  totalAmount: "",
  lC_Number: "",
  wharfID: 0,
  shedID: 0,
  conversionUnitID: 0,
  insertItemModels: null,
  fileNo: "",
  customerName: "",
  customType: "",
}

let InitialOtherState = {
  shipmentTypeID : 0,
  shipmentTypeDetailID: 0,
  cargoTypeID: 0,
  cargoTypeDetailID: 0,
  count: "",
  itemCategoryID: 0,
  terminalID: 0,
  collectorateID: 0,
  bankID : 0
}


export default function OCRDialoge({ open, Base64Image, ocrid, handleClose, ocrData, GetList,PDF }) {
  const worker = createWorker({
    logger: (m) => console.log(m),
  });

  const theme = useTheme();
  const [ocr, setOcr] = useState('Recognizing...');
  const [OpenFieldDialog, setOpenFieldDialog] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [state, setState] = useState(InitialState);
  const [product, setProduct] = useState([]);
  const [shedList, setshedList] = useState([]);
  const [conversionList, setConversionList] = useState([]);
  const [customTypeList, setCustomTypeList] = useState([]);
  const [cargoTypeList, setCargoTypeList] = useState([]);
  const [itemCategoryList, setitemCategoryList] = useState([]);
  const [teminalList, setTerminalList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [collectorateList, setCollectorateList] = useState([]);
  const [shipmentDetailsList, setShipmentDetailsList] = useState([]);
  const [cargoTypeDetailList, setcargoTypeDetailList] = useState([]);
  const [wharfList, setwharfList] = useState([]);
  const [openLoader, setopenLoader] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [shouldSubmit, setshouldSubmit] = useState(false);
  const [productState, setProductState] = useState({
    noOfPkgs: "",
    item: "",
    grossWeight: "",
    netWeight: "",
    harmonizedSystemCode: ""
  });

  const [errorProduct, setErrorProduct] = useState({});
  const [error, setError] = useState({});
  const dispatch = useDispatch();

  const [other, setOther] = useState(InitialOtherState);
  const [list, setList] = useState([])
  const [errorShipment, setErrorShipment] = useState({})

  const handleOtherChange = (event) => {
      let { name, value } = event.target;
      setOther({ ...other, [name]: value })

      if(name === "shipmentTypeID"){
        getShipmentTypeDetail(value)
        getCollectorate(value)
      }
      if(name === "cargoTypeID"){
        getCargoTypeDetail(value)
      }

      setErrorShipment({ ...errorShipment, [name]: null })
  };

  const removeItemProduct = (indexToRemove) => {
    const newData = [...product];
    newData.splice(indexToRemove, 1);
    setProduct(newData);
  };

  useEffect(()=>{
    setOther({...other, shipmentTypeDetailID : 0})
  },[other.customTypeID])

  useEffect(()=>{
    setOther({...other, cargoTypeDetailID : 0})
  },[other.cargoTypeID])

  const handleOtherChangeNumber = (event) => {
      let { name, value } = event.target;
      const isValidInput = /^[+-]?\d+(\.\d*)?$/.test(value);
      if (isValidInput || value === '') {
          setOther({ ...other, [name]: value })
          setErrorShipment({ ...errorShipment, [name]: null })
      }
  }

  const toggleDrawer = () => {
    setOpenDrawer(false)
  };
  const handleLoader = () => {
    setopenLoader(false)
  };

  const selectField = (field) => {

    
    let { name, type } = field;
    if (type === "state") {
      setState({ ...state, [name]: ocr })
    }
    else {
      setProductState({ ...productState, [name]: ocr })
    }
    setOpenFieldDialog(false)
  };

  const handleOpenFieldDialog = () => {
    setOpenFieldDialog(false)
  };

  const setFieldData = () => {

    setState({
      ...state,

      billOfLading: ocrData.billOfLading || "",
      vessel: ocrData.vessel || "",
      voyNo: ocrData.voyNo || "",
      portofLoading: ocrData.portofLoading || "",
      portofDischarge: ocrData.portofDischarge || "",
      placeofDelivery: ocrData.placeofDelivery || "",
      placeofReceipt: ocrData.placeofReceipt || "",
      shipperName: ocrData.shipperName || "",
      companyName: ocrData.companyName || "",
      totalAmount: ocrData.totalAmount || "",
      lC_Number: ocrData.lC_Number || "",
      fileNo: ocrData.fileNo || "",
      customerName: ocrData.customerName || "",
      customType: ocrData.customType || "",
      freightForward: ocrData.freightForwarderShippingLine || "",
      shippingTerm: ocrData.shippingTerms || "",
      InvoiceNo: ocrData.invoiceNo || "",
      freightTerm: ocrData.freightTerms || "",
      consignee: ocrData.consignee || "",
    })

    setProductState({
      ...productState,
      noOfPkgs: ocrData.noOfPkgs || "",
      item: ocrData.item || "",
      grossWeight: ocrData.grossWeight || "",
      netWeight: ocrData.netWeight || "",
      harmonizedSystemCode: ocrData.harmonizedSystemCode || "",
    })
  }

  useEffect(() => {
    if (ocrData) {
      setFieldData()
    }
  }, [ocrData]);

  const getShedList = () => {

    AxiosServices.getShedList().then((res) => {

      let { data, message } = res?.data;

      if (data) {
        setshedList(data);
      }

    })
  }
  const getWharfList = () => {
    AxiosServices.getWharfList().then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setwharfList(data)
      }

    })
  }

  const getConversionList = () => {

    let model = {  conversionUnitName : null}

    AxiosServices.getConversionList(model).then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setConversionList(data)
      }

    })
  }

  const getCustomType = () => {

    AxiosServices.getCustomType().then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setCustomTypeList(data)
      }

    })
  }

  const getCargoType = () => {

    AxiosServices.getCargoType().then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setCargoTypeList(data)
      }

    })
  }

  const getItemCategory = () => {

    AxiosServices.getItemCategory().then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setitemCategoryList(data)
      }

    })
  }

  const getTerminal = () => {

    AxiosServices.getTerminal().then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setTerminalList(data)
      }

    })
  }
  const getBankList = () => {

    AxiosServices.getBankList().then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setBankList(data)
      }

    })
  }

  const getCollectorate = (Id) => {

    AxiosServices.getCollectorate({customTypeID : Id}).then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setCollectorateList(data)
      }

    })
  }

  const getShipmentTypeDetail = (Id) => {

    AxiosServices.getShipmentTypeDetail({customTypeID : Id}).then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setShipmentDetailsList(data)
      }

    })
  }

  const getCargoTypeDetail = (Id) => {

    AxiosServices.getCargoTypeDetail({cargoTypeID : Id}).then((res) => {

      let { data, message } = res?.data;
      if (data) {
        setcargoTypeDetailList(data)
      }

    })
  }

  useEffect(() => {

    getShedList()
    getWharfList()
    getConversionList()
    getCustomType()
    getCargoType()
    getItemCategory()
    getTerminal()
    getBankList()
    // getCollectorate()

  }, []);

  const onhandleAddProduct = () => {

    setError({ ...error, insertItemModels: null });
    const newData = [
      ...product,
      productState
    ];
    setProduct(newData)

  }

  const AddProduct = () => {
    clearingProduct
      .validate(productState, { abortEarly: false })
      .then(() => {
        onhandleAddProduct()
      })
      .catch((err) => {
        // if state is invalid, update Errors state with error messages
        const newErrors = {};
        if (err && err.inner) {
          err.inner.forEach((error) => {
            newErrors[error.path] = error.message;
          });
        }
        setErrorProduct(newErrors);
      });
  }

  const handleChange = (event) => {
    let { name, value } = event.target;
    setState({ ...state, [name]: value });
    setError({ ...error, [name]: null });
  }

  const handleChangeNumber = (event) => {
    let { name, value } = event.target;
    const isValidInput = /^[+-]?\d+(\.\d*)?$/.test(value);
    if (isValidInput || value === '') {
      setState({ ...state, [name]: value });
      setError({ ...error, [name]: null });
    }
  }

  const handleChangeProduct = (event) => {
    let { name, value } = event.target;
    setProductState({ ...productState, [name]: value });
    setErrorProduct({ ...errorProduct, [name]: null });
  }

  const InsertClearDetails = () => {

    let newState = { ...state };
    

    delete newState.fileNo;
    delete newState.customerName;
    delete newState.customType;

    let model = {
      ...newState,
      insertItemModels: product,
      ocrid: ocrid,
      totalAmount: parseFloat(state.totalAmount),
      freightForwarderShippingLine: state.freightForward,
      freightTerms: state.freightTerm,
      shippingTerms: state.shippingTerm,
      invoiceNo: state.InvoiceNo,
      conversionUnitID: state.conversionUnitID,
      shippingDetails : list,
    }

    AxiosServices.insertClearingDetail(model).then((res) => {

      let { data, message } = res?.data;
      
      dispatch(
        openSnackbar({
          open: true,
          message: message === "Save Successfully." ? "Saved Successfully." : message,
          variant: 'alert',
          alert: {
            color: message === "Save Successfully." ? 'success' : "error"
          },
          close: true
        })
      );

      if (message === "Save Successfully.") {
        handleClose(false)
        setshouldSubmit(false)
        GetList()
      }

    })
  }
  const onSubmit = () => {

    let model = {
      ...state,
      insertItemModels: product.length === 0 ? null : product,
    }
    clearingForm
      .validate(model, { abortEarly: false })
      .then(() => {
        if(list.length === 0){
          setshouldSubmit(true)
        }
        else{
          InsertClearDetails()
        }
      })
      .catch((err) => {
        const newErrors = {};
        if (err && err.inner) {
          err.inner.forEach((error) => {
            newErrors[error.path] = error.message;
          });
        }
        setOpenDrawer(true)
        setError(newErrors);
        setshouldSubmit(false)
      });
  }

  const onhandleAddShipment = () => {

    
    let customTypeListObj = customTypeList.find(x => x.customTypeID === other.shipmentTypeID);
    let shipmentDetailsListObj = shipmentDetailsList.find(x => x.shipmentTypeDetailID === other.shipmentTypeDetailID);
    let cargoTypeListObj = cargoTypeList.find(x => x.cargoTypeID === other.cargoTypeID);
    let cargoTypeDetailListObj = cargoTypeDetailList.find(x => x.cargoTypeDetailID === other.cargoTypeDetailID);
    let itemCategoryListObj = itemCategoryList.find(x => x.itemCategoryID === other.itemCategoryID);
    let teminalListObj = teminalList.find(x => x.terminalID === other.terminalID);
    let collectorateListObj = collectorateList.find(x => x.collectorateID === other.collectorateID);

    const newData = [
        ...list,
        { ...other,
            customType : customTypeListObj.customType,
            shipmentTypeDetailName : shipmentDetailsListObj.shipmentTypeDetailName,
            cargoTypeName : cargoTypeListObj.cargoTypeName,
            cargoTypeDetailName : cargoTypeDetailListObj.cargoTypeDetailName,
            itemCategoryName : itemCategoryListObj.itemCategoryName,
            terminalName : teminalListObj.terminalName,
            collectorateName : collectorateListObj.collectorateName,
        },
    ];
    setList(newData)
}

useEffect(()=>{
    if(shouldSubmit && list.length === 0){
      handleAddShipment()
    }
    else if(shouldSubmit && list.length > 0){
      onSubmit()
    }
},[shouldSubmit,list])

const handleAddShipment = () => {
      
    shipmentDetails
        .validate(other, { abortEarly: false })
        .then(() => {
            onhandleAddShipment()
        })
        .catch((err) => {
          
            const newErrors = {};
            if (err && err.inner) {
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
            }
            setErrorShipment(newErrors);
        });
}


  return (
    <React.Fragment>
      <Dialog fullScreen open={open} onClose={() => handleClose(false)} TransitionComponent={Transition} className="OCR-Dialog">
        <AppBar position="sticky">
          <Toolbar style={{ justifyContent: "space-between", background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}>
            <IconButton
              onClick={() => setOpenDrawer(true)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, ml: 1 }}
            >
              <MenuIcon />
            </IconButton>

            <div style={{ display: 'flex', gap: "15px", marginRight: "12px" }}>
              <Button autoFocus color="inherit" onClick={() => handleClose(false)}>
                Discard
              </Button>
              <Button variant='outlined' color="inherit" autoFocus onClick={() => onSubmit()}>
                Submit
              </Button>
            </div>
          </Toolbar>
        </AppBar>
        <Grid container spacing={0} style={{ height: '100%' }} >
          <Grid item xs={12}>
            {PDF && <div>
              <iframe src={PDF} width="100%" height="500px" />
            </div>
            }
            {Base64Image.map((x, index) => {
              return (
                   <img
                    src={x}
                    alt="Crop preview"
                  /> 
              )
            })}
          </Grid>
        </Grid>
        {OpenFieldDialog && <FieldsDialog openDialog={OpenFieldDialog} handleClose={handleOpenFieldDialog} selectField={selectField} />}
        {openLoader && <OCR_Loader open={openLoader} handleClose={handleLoader} isLoading={isLoading} />}
        <ClearingDrawer
          open={openDrawer}
          handleClose={toggleDrawer}
          state={state}
          product={product}
          shedList={shedList}
          wharfList={wharfList}
          productState={productState}
          errorProduct={errorProduct}
          AddProduct={AddProduct}
          handleChange={handleChange}
          handleChangeNumber={handleChangeNumber}
          handleChangeProduct={handleChangeProduct}
          onSubmit={onSubmit}
          error={error}
          theme={theme}
          conversionList={conversionList}
          customTypeList={customTypeList}
          cargoTypeList={cargoTypeList}
          itemCategoryList={itemCategoryList}
          teminalList={teminalList}
          collectorateList={collectorateList}
          shipmentDetailsList={shipmentDetailsList}
          cargoTypeDetailList={cargoTypeDetailList}
          bankList={bankList}
          other={other}
          handleOtherChangeNumber={handleOtherChangeNumber}
          errorShipment={errorShipment}
          handleOtherChange={handleOtherChange}
          setErrorShipment={setErrorShipment}
          setList={setList}
          list={list}
          handleAddShipment={handleAddShipment}
          removeItemProduct={removeItemProduct}
        />
      </Dialog>
    </React.Fragment>
  );
}
