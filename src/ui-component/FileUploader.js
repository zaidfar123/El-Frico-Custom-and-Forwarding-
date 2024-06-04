// material-ui
import React from "react";
import { Grid, Typography, Card, CardHeader, Avatar, IconButton} from '@mui/material';
import utilsJS from "utilsJS";
import { FileUploader } from "react-drag-drop-files";
import { useTheme, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';


const fileTypes = ["JPG", "JPEG", "Png", "PDF"];

export default function CustomFileUploader({setFile,file,setError,error}) {

    const theme = useTheme();

    const handleFileChange = (file) => {
        setFile(file)
        setError({ ...error, file: null })
    };

    const RemoveDocument = (index) => {

        let FilteredFiles = Array.from(file).filter((item, idx) => idx !== index);
        setFile(FilteredFiles)
    }
 
    return (
        <React.Fragment>
            <Grid item xs={12}>
                <Typography variant="subtitle1">Attach Documents</Typography>
                <FileUploader
                    classes="file-uploader"
                    multiple={true}
                    handleChange={handleFileChange}
                    name="file"
                    types={fileTypes}
                    style={{ border: "dashed 2px #0658c2", width: "100%" }}
                >
                    <div className="uploader-wrapper" style={{ borderColor: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-upload" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke={theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark} fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                            <path d="M7 9l5 -5l5 5" />
                            <path d="M12 4l0 12" />
                        </svg>
                        <div className="uploader-text">
                            <span>
                                Drag and Drop here
                            </span>
                            <span>
                                or
                            </span>
                        </div>
                        <div className="uploader-button">
                            <span style={{ color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark }}>
                                Browse files
                            </span>
                        </div>
                    </div>
                </FileUploader>
                <div className="uploader-captions">
                    <Typography style={{ textTransform: "capitalize" }} variant="overline">Accepted File Types: JPEG, JPG, PNG, PDF</Typography>
                    <Typography style={{ textTransform: "capitalize", color: "#f44336" }} variant="overline">{error.file}</Typography>
                </div>
            </Grid>

            <Grid container spacing={3} sx={{ p: 3 }}>

                {file.length > 0 && Array.from(file).map((item, index) =>
                (<Grid item xs={6}>
                    <Card style={{
                        border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark}`,
                    }}>
                        <CardHeader
                            avatar={
                                <Avatar src={utilsJS.getImageByExtention(item)} aria-label="img" />
                            }
                            action={
                                <IconButton aria-label="settings" onClick={() => RemoveDocument(index)}>
                                    <CloseIcon />
                                </IconButton>
                            }
                            title={item.name}
                            subheader={utilsJS.getDocumentSize(item.size)}
                        /></Card>
                </Grid>)
                )}

            </Grid>
        </React.Fragment>

    );
}
