// material-ui
import React, { useState, useEffect } from "react";
import { IconButton, Tooltip } from '@mui/material';
import { useDispatch } from 'react-redux';
import docuemntImage from "assets/images/document.gif"
import { openLoader } from 'store/slices/loadingModal';
import { saveAs } from 'file-saver'; // v2.0.5

export default function DownloadFile({ icon, model, DownloadService, filename,title,disabled = false }) {

    const dispatch = useDispatch();

    const downloadPDF = async () => {

        handleLoaderDispatch(true, "Please wait while we are downloading your file.", docuemntImage);

        DownloadService(model)
            .then(response => {
                saveAs(response.data, filename)
                handleLoaderDispatch(false, "", null)
            })
            .catch(e => {
                console.error('Error downloading:', e);
                handleLoaderDispatch(false, "", null)
            });

    }

    const handleLoaderDispatch = (open, description, hasImage) => {
        dispatch(openLoader({
            open: open,
            description: description,
            hasImage: hasImage
        }))
    }

    return (
        <Tooltip title={title}>
            <IconButton
                aria-label="delete"
                size="small"
                onClick={() => downloadPDF()}
                disabled={disabled}
            >
                {icon}
            </IconButton>
        </Tooltip>
    );
}