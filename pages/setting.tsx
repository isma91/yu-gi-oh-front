import DashboardHome from "@components/dashboard/Home";
import Collapse from "@components/display/Collapse";
import EditPasswordForm from "@form/user/edit-password";
import EditUsernameForm from "@form/user/edit-username";
import { Grid, Typography } from "@mui/material";

export default function SettingPage() {
    return (
        <DashboardHome active={4} title="Setting Page">
            <Grid item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(2) }}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Collapse triggerElement={<Typography component="span">Change your Password</Typography>}>
                        <Grid item xs={12} container spacing={2} justifyContent="center">
                            <EditPasswordForm />
                        </Grid>
                    </Collapse>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Collapse triggerElement={<Typography component="span">Change your Username</Typography>}>
                        <Grid item xs={12} container spacing={2} justifyContent="center">
                            <EditUsernameForm />
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
