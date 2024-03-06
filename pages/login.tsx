"use client";
import { Grid, Paper, Box, Avatar, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginForm from "@form/user/login";
import { GetRandomElement } from "@utils/Array";

function Login(): React.JSX.Element {
    const getAllLoginImageUrl = () => {
        const numImage: number = 7;
        const numberArray: number[] = Array.from(Array(numImage).keys());

        let arrayImageUrl: string[] = [];
        numberArray.forEach((v) => {
            arrayImageUrl.push(`/static/images/login/${v}.jpg`);
        });
        return arrayImageUrl;
    };
    const loginImageUrl = GetRandomElement(getAllLoginImageUrl(), 1);

    return (
        <Grid container sx={{ height: "100%" }}>
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: `url(${loginImageUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Yu-Gi-Oh!
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <LoginForm />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}

export default Login;
