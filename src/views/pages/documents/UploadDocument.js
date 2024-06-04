// material-ui
import React, { useState, useEffect } from "react";
import { Grid, Button,  } from '@mui/material';
import AxiosServices from "service";
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useDispatch } from 'react-redux';
import AutoComplete from "ui-component/AutoComplete";
import { useTheme, styled } from '@mui/material/styles';
import { uploadDocuments } from "validation";
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';
import CustomFileUploader from "ui-component/FileUploader"
import { openLoader } from 'store/slices/loadingModal';
import docuemntImage from "assets/images/upload.gif"


const InitialState = {
    customerID : 0
}

export default function UploadDocument() {

    const dispatch = useDispatch();
    const theme = useTheme();

    const OptionDescription = (option) => option.customerName || "";
    const [selectedOptionCustomer, setSelectedOptionCustomer] = useState("");
    const [file, setFile] = useState([]);
    const [error, setError] = useState({})
    const [state, setState] = useState(InitialState);
    const { user } = useAuth();

    let uploadRequestInstance = null;

    const UploadDocuments = () => {
        const formdata = new FormData();
        formdata.append("CustomerID", state.customerID);
        formdata.append("UserID", user.id);
        Array.from(file).map((item) => {
            formdata.append("file", item);
        })

        uploadRequestInstance = AxiosServices.insertOCR_File(formdata);

        handleLoaderDispatch
        (true, 
        "Please wait while we're uploading the documents.",
        docuemntImage,
        false,
        null
        )

        uploadRequestInstance.then(data => {
            const { message } = data?.data
            if ( message === "File Save Successfully.") {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Document(s) uploaded successfully",
                        variant: 'alert',
                        alert: {
                            color: "success"
                        },
                        close: true
                    })
                );
                setFile([])
                setSelectedOptionCustomer("")
                setState(InitialState)
            }
            else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Something went wrong",
                        variant: 'alert',
                        alert: {
                            color: "error"
                        },
                        close: true
                    })
                );
            }
            handleLoaderDispatch(false,"",null,false,null)
        })
            .catch(e => {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Something went wrong",
                        variant: 'alert',
                        alert: {
                            color: "error"
                        },
                        close: true
                    })
                );
                handleLoaderDispatch(false,"",null,false,null)
                console.error(e);
            });
    }

    const handleUpload = () => {

        let model = {
            ...state,
            file: file.length === 0 ? null : file,
        }
        uploadDocuments
            .validate(model, { abortEarly: false })
            .then(() => {
                UploadDocuments()
            })
            .catch((err) => {
                const newErrors = {};
                if (err && err.inner) {
                    err.inner.forEach((error) => {
                        newErrors[error.path] = error.message;
                    });
                }
                setError(newErrors);
            });
    };

    const handleAbort = () => {
        if (uploadRequestInstance) {
            console.log(uploadRequestInstance)
          uploadRequestInstance.reject();
        }
      };

    const setOptionsChanges = (options, field) => {
        
        if (options) {
            setState({ ...state, [field]: options.customerID })
        } else {
            setState({ ...state, [field]: 0 })
        }
        setError((prevErrors) => ({
            ...prevErrors,
            [field]: null,
        }));
    };

    const handleLoaderDispatch = (open, description, hasImage, action, actionfunction) => {
        dispatch(openLoader({
            open: open,
            description: description,
            hasImage: hasImage,
            button:action,
            buttonAction: actionfunction
        }))
    }

    // useEffect(() => {
    
    //     return () => {
    //       if (uploadRequestInstance) {
    //         uploadRequestInstance.reject();
    //       }
    //     };

    //   }, []);

    return (
        <MainCard title="Upload Document">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <AutoComplete
                        setOptionsChanges={setOptionsChanges}
                        state={state}
                        errors={error}
                        selectedOption={selectedOptionCustomer}
                        setSelectedOption={setSelectedOptionCustomer}
                        searchSuggestions={AxiosServices.searchCustomer}
                        getOptionLabel={OptionDescription}
                        field={"customerID"}
                        label={"Customer"}
                        disabled={false}
                    />
                </Grid>
                <CustomFileUploader file={file} setFile={setFile} setError={setError} error={error} />
                <Grid item xs={12}>
                    <Button fullWidth variant="contained" onClick={handleUpload}>Upload Documents</Button>
                </Grid>
            </Grid >
        </MainCard >

    );
}
