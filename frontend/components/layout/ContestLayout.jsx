import Grid from '@mui/material/Grid';
import ContestMenu from "@/components/common/ContestMenu";

const ContestLayout = ({ children }) => {
    return (
        <>
            <Grid container spacing={2} sx={{ paddingTop: 2, paddingLeft: 3 }}>
                <Grid item xs={10}>
                    {children}
                </Grid>
                <Grid item xs={2}>
                    <ContestMenu />
                </Grid>
            </Grid>
        </>
    )
}

export default ContestLayout;