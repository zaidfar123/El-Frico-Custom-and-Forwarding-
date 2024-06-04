import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
let CLEARING_lIST_APPROVAL = ["Approver", 'RFP Coordinator'] 
let CLEARING_lIST_PERMISSION = ["RFP Initiated"] 

const ApprovalButtons = {

  ApproveIcon: (props) => {
    const handleSubmit = async () => {
        props.onApproval(props)
    };
    return (
      <Tooltip title="Approve">
        <IconButton size="small" color="success" disabled={props.disabled} aria-label="approve" onClick={handleSubmit}>
          <CheckIcon />
        </IconButton>
      </Tooltip>
    );
  },

  RejectIcon: (props) => {
    const handleSubmit = async () => {
        props.onApproval(props)
    };
    return (
      <Tooltip title="Reject">
        <IconButton size="small" color="error" disabled={props.disabled} aria-label="approve" onClick={handleSubmit}>
          <CloseIcon />
        </IconButton>
      </Tooltip>
    );
  },

  ApproveButton: (props) => {
    const handleSubmit = async () => {
        props.onApproval(props)
    };
    return (
        <LoadingButton
        color="primary"
        onClick={handleSubmit}
        loading={props.isLoading}
        disabled={props.disabled}
        loadingPosition="start"
        startIcon={<CheckIcon />}
        variant="contained"
        className={props.class || ""}
      >
        <span>Approve</span>
      </LoadingButton>
    );
  },

  RejectButton: (props) => {
    const handleSubmit = async () => {
        props.onApproval(props)
    };
    return (
        <LoadingButton
        color="error"
        onClick={handleSubmit}
        loading={props.isLoading}
        disabled={props.disabled}
        loadingPosition="start"
        startIcon={<CloseIcon />}
        variant="contained"
        className={props.class || ""}
      >
        <span>Reject</span>
      </LoadingButton>
    );
  },

  isAuthentic: (role) => {
    return CLEARING_lIST_APPROVAL.includes(role)
  },
  isEnabled: (status) => {
    return CLEARING_lIST_PERMISSION.includes(status)
  },
};

export default ApprovalButtons;