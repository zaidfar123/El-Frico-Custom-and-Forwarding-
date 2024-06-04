import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'store';
import { Loading } from 'react-loading-dot'
import { useTheme } from '@mui/material/styles';
import DotLoader from "./dot-loader"
import CircularProgress, { circularProgressClasses} from '@mui/material/CircularProgress';
import {Box} from '@mui/material'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function FacebookCircularProgress(props) {
    return (
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) =>
              theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
          }}
          size={30}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) => (theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark),
            animationDuration: '550ms',
            position: 'absolute',
            left: 0,
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={30}
          thickness={4}
          {...props}
        />
      </Box>
    );
  }
export default function LoadingModal() {

    const dispatch = useDispatch();
    const loader = useSelector((state) => state.loader);
    const { description, open, hasImage,button,buttonAction } = loader;
    const theme = useTheme();

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                fullWidth={true}
                maxWidth={"xs"}
            >
                <DialogContent style={{padding : "10px 24px"}}>
                    <DialogContentText id="alert-dialog-slide-description">
                        <div className="loading-dialog">
                            {hasImage && <img src={hasImage} />}
                            <p>{description}</p>
                            <div className="stage">
                            {!button && <FacebookCircularProgress />}
                            </div>
                        </div>

                    </DialogContentText>
                   {button && <div style={{display: 'flex', justifyContent: 'end'}}>
                      <Button onClick={()=>buttonAction()} variant="outlined" size='small'>Cancel</Button>
                    </div>}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
}
