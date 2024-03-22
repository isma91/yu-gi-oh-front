import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Grid, Typography, Collapse as CollapseMUI, SxProps, Theme } from "@mui/material";

type CollapsePropsType = {
    triggerElement: string | React.JSX.Element;
    triggerElementButton?: boolean;
    initialValue?: boolean;
    collapseSx?: SxProps<Theme>;
    children: string | React.JSX.Element | React.JSX.Element[];
};

export default function Collapse(props: CollapsePropsType): React.JSX.Element {
    const { triggerElement, children } = props;
    let initialValue = false;
    if (props.initialValue !== undefined) {
        initialValue = props.initialValue;
    }
    const [open, setOpen] = useState(initialValue);
    let isButton = false;
    if (props.triggerElementButton !== undefined) {
        isButton = props.triggerElementButton;
    }
    let collapseSx: SxProps<Theme> = {
        width: "100%",
        marginTop: (theme) => theme.spacing(2),
    };
    if (props.collapseSx !== undefined) {
        collapseSx = props.collapseSx;
    }

    return (
        <>
            <Typography component="span" onClick={(e) => setOpen(!open)} sx={{ cursor: "pointer" }}>
                {isButton === true ? (
                    triggerElement
                ) : (
                    <>
                        {triggerElement}
                        {open === true ? (
                            <KeyboardArrowUpIcon sx={{ verticalAlign: "middle" }} />
                        ) : (
                            <KeyboardArrowDownIcon sx={{ verticalAlign: "middle" }} />
                        )}
                    </>
                )}
            </Typography>
            <Grid item xs={12} container spacing={2} sx={{ margin: "auto" }}>
                <CollapseMUI in={open} timeout="auto" sx={{ ...collapseSx }}>
                    {children}
                </CollapseMUI>
            </Grid>
        </>
    );
}
