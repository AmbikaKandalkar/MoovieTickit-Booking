import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import React, { ReactNode } from "react";

interface IDialg {
    openDialog: boolean;
    onClose:()=> void;
    children:ReactNode

}
const DialogBox = (props: IDialg) => {
    let { openDialog, onClose ,children} = props
    return <Dialog open={true} onClose={() => onClose}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
            {children}
        </DialogContent>
        
    </Dialog>
}

export default DialogBox