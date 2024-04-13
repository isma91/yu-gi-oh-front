import DashboardHome from "@components/dashboard/Home";
import UserCraeteForm from "@form/user/create";
import { Grid } from "@mui/material";

export default function AdminUserCreatePage() {
    return (
        <DashboardHome active={6} activeChild={0} title="Admin User create page">
            <Grid item xs={12}>
                <UserCraeteForm />
            </Grid>
        </DashboardHome>
    );
}
