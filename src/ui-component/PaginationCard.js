import * as React from 'react';
import { Stack, Pagination, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CardSkeleton from "ui-component/CardSkeleton";

export default function CustomPagination(props) {
    const { list, count, handleChangePage, page, isLoading } = props;
    const theme = useTheme();
    const styled = {
        color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
    }
    return (
        <Stack spacing={3} alignItems="center" style={{ padding: "8px", background: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.background.paper, borderRadius: "4px" }}>
            {isLoading ? (
                <Grid container spacing={2}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                        <Grid key={index} item xs={12} sm={4} md={4} lg={3}>
                            <CardSkeleton />
                        </Grid>
                    ))}
                </Grid> // MUI Loader when isLoading is true and list has no data
            ) : !isLoading && list.length === 0 ? (
                <p style={styled} >No record found</p> // Display "No record found" when isLoading is false and list has no data
            ) : (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Pagination
                                size="small"
                                variant="outlined"
                                color="secondary"
                                defaultPage={1}
                                siblingCount={0}
                                count={count}
                                page={page}
                                onChange={handleChangePage}
                            />
                        </div>
                    </div>
                </>
            )}
        </Stack>
    );
}
