import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Typography } from "@mui/material";
import Dialog from "@components/display/Dialog";

type SensitiveDataPropsType = {
    name: string;
    children: React.JSX.Element | React.JSX.Element[];
    confirm?: boolean;
};

export default function SensitiveData(props: SensitiveDataPropsType) {
    const { name, children } = props;
    const [display, setDisplay] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    let needConfirm = false;
    if (props.confirm !== undefined) {
        needConfirm = props.confirm;
    }

    const handleIcon = () => {
        let newDisplay = !display;
        if (newDisplay === false || (needConfirm === false && newDisplay === true)) {
            setDisplay(newDisplay);
        } else if (newDisplay === true && needConfirm === true) {
            setOpenDialog(true);
        } else {
            setDisplay(newDisplay);
        }
    };

    const displayIcon = () => {
        return (
            <span style={{ cursor: "pointer" }} onClick={handleIcon}>
                {display === true ? (
                    <VisibilityOffIcon fontSize="medium" sx={{ marginLeft: (theme) => theme.spacing(1) }} />
                ) : (
                    <VisibilityIcon fontSize="medium" sx={{ marginLeft: (theme) => theme.spacing(1) }} />
                )}
            </span>
        );
    };

    const displayData = () => {
        return <Typography component="span">{display === true ? children : null}</Typography>;
    };

    const displayDialog = () => {
        return (
            <Dialog
                name={`sensitive-data-${name}`}
                openState={[openDialog, setOpenDialog]}
                title="Please confirm to display the sensitive data"
                elementTrigger={""}
                confirm
                confirmYes={() => setDisplay(true)}
            ></Dialog>
        );
    };

    return (
        <>
            {needConfirm === true ? displayDialog() : null}
            {displayData()}
            {displayIcon()}
        </>
    );
}
