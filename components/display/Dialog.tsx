import React, { useState } from "react";
import { useTheme, useMediaQuery, Dialog as DialogMUI, Typography, DialogTitle, IconButton, DialogContent, DialogActions, Grid } from "@mui/material";
import GenericStyles from "@app/css/style";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@components/field/Button";
import { CancelPropagation } from "@utils/Event";

type DialogType = {
    name: string;
    elementTrigger: string | React.JSX.Element;
    elementTriggerClassName?: string;
    elementTriggerInButton?: true;
    title: string | React.JSX.Element;
    titleClassName?: string;
    children?: React.JSX.Element | React.JSX.Element[] | string | number;
    authorizeOpen?: boolean;
    confirm?: true;
    confirmYes?: (event: React.MouseEvent) => void;
    confirmNo?: (event: React.MouseEvent) => void;
    fullWidth?: boolean;
    openState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

export default function Dialog(props: DialogType) {
    const { name, elementTrigger, title } = props;
    let open: boolean;
    let setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    [open, setOpen] = useState<boolean>(false);
    if (props.openState !== undefined) {
        open = props.openState[0];
        setOpen = props.openState[1];
    }
    const genericClasses = GenericStyles();
    const Theme = useTheme();
    const mediaQueryDownSm = useMediaQuery(Theme.breakpoints.down("xs"));

    let elementTriggerOption = {
        className: "",
        onClick: (e: React.MouseEvent) => handleElementTrigger(e),
    };
    let elementTriggerClassName = props.elementTriggerInButton === undefined ? genericClasses.cursorPointer : "";
    if (props.elementTriggerClassName !== undefined) {
        elementTriggerClassName += ` ${props.elementTriggerClassName}`;
    }
    let authorizeOpen = true;
    if (props.authorizeOpen !== undefined) {
        authorizeOpen = props.authorizeOpen;
    }
    let confirm = false;
    if (props.confirm !== undefined) {
        confirm = true;
    }

    const handleClose = (e: React.MouseEvent) => {
        CancelPropagation(e);
        setOpen(false);
    };

    const handleYesNo = (e: React.MouseEvent, fieldName: "confirmYes" | "confirmNo") => {
        CancelPropagation(e);
        setOpen(false);
        const propsFieldName = props[fieldName];
        if (propsFieldName !== undefined) {
            propsFieldName(e);
        }
    };

    const handleYes = (e: React.MouseEvent) => {
        handleYesNo(e, "confirmYes");
    };

    const handleNo = (e: React.MouseEvent) => {
        handleYesNo(e, "confirmNo");
    };

    const handleElementTrigger = (event: React.MouseEvent) => {
        CancelPropagation(event);
        if (authorizeOpen === true) {
            setOpen(true);
        }
    };

    let fullWidth = false;
    if (props.fullWidth !== undefined) {
        fullWidth = props.fullWidth;
    }

    return (
        <>
            {props.elementTriggerInButton ? (
                <Button {...elementTriggerOption} type="button" loading={false}>
                    {elementTrigger}
                </Button>
            ) : (
                <Typography {...elementTriggerOption} component="span">
                    {elementTrigger}
                </Typography>
            )}
            <DialogMUI
                fullScreen={mediaQueryDownSm}
                fullWidth={fullWidth}
                open={open}
                onClose={handleClose}
                aria-label={`dialog-${name}`}
                onClick={CancelPropagation}
            >
                <DialogTitle
                    className={`${genericClasses.textAlignCenter}`}
                    sx={{
                        marginTop: Theme.spacing(3),
                        marginLeft: Theme.spacing(3),
                        marginRight: Theme.spacing(3),
                        marginBottom: Theme.spacing(0),
                    }}
                >
                    {title}
                </DialogTitle>
                <IconButton
                    aria-label={`dialog-${name}-icon-close`}
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        top: Theme.spacing(1),
                        right: Theme.spacing(1),
                        color: Theme.palette.primary.main,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {props.children !== undefined ? <DialogContent>{props.children}</DialogContent> : null}
                {props.confirm ? (
                    <DialogActions>
                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Button onClick={handleYes} loading={false}>
                                    Yes
                                </Button>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Button onClick={handleNo} loading={false}>
                                    No
                                </Button>
                            </Grid>
                        </Grid>
                    </DialogActions>
                ) : null}
            </DialogMUI>
        </>
    );
}
