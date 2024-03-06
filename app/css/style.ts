import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

export default makeStyles((theme: Theme) => ({
    marginTop: {
        marginTop: `${theme.spacing(2)} !important`,
    },
    marginBottom: {
        marginBottom: `${theme.spacing(2)} !important`,
    },
    cursorPointer: {
        cursor: "pointer !important",
    },
    errorColor: {
        color: `${theme.palette.error.main} !important`,
    },
    errorText: {
        color: `${theme.palette.error.main} !important`,
        textAlign: "center",
        fontWeight: "bolder !important"
    },
    greyLight: {
        color: theme.palette.grey[600],
    },
    helperTextFontSize: {
        fontSize: "1rem",
        [theme.breakpoints.down("sm")]: {
            fontSize: "0.75rem",
        },
    },
    positionSticky: {
        top: "0px",
        position: "sticky",
    },
    backgroundColorPrimaryMain: {
        "&:hover": {
            backgroundColor: `${theme.palette.primary.main} !important`,
        },
        backgroundColor: `${theme.palette.primary.main} !important`,
    },
    backgroundColorSecondaryMain: {
        "&:hover": {
            backgroundColor: `${theme.palette.secondary.main} !important`,
        },
        backgroundColor: `${theme.palette.secondary.main} !important`,
    },
    backgroundColorThirdMain: {
        "&:hover": {
            backgroundColor: `${theme.palette.third.main} !important`,
        },
        backgroundColor: `${theme.palette.third.main} !important`,
    },
    colorPrimaryMain: {
        color:`${theme.palette.primary.main} !important`,
    },
    colorSecondaryMain: {
        color:`${theme.palette.secondary.main} !important`,
    },
    colorThirdMain: {
        color:`${theme.palette.third.main} !important`,
    },
    verticalAlign: {
        verticalAlign: "middle !important",
    },
    bold: {
        fontWeight: "bold !important",
    },
    italic: {
        fontStyle: "italic !important",
    },
    textAlignCenter: {
        textAlign: "center",
    },
    borderPrimary: {
        border: `2px solid ${theme.palette.primary.main} !important`,
    },
    borderSecondary: {
        border: `2px solid ${theme.palette.secondary.main} !important`,
    },
    borderThird: {
        border: `2px solid ${theme.palette.third.main} !important`,
    },
    hidden: {
        display: "none",
        visibility: "hidden",
    }
}));