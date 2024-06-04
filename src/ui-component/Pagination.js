import * as React from 'react';
import { MenuItem, Select, Stack, Pagination, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function CustomPagination(props) {
    const { list, count, rowsPerPage, handleChangeRowsPerPage, handleChangePage, page, isLoading } = props;
    const theme = useTheme();
    const styled = {
        padding : "8px",
        color : theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
    }
    return (
        <Stack spacing={3} alignItems="center" style={{ padding : "10px" }}>
            {isLoading && list.length === 0 ? (
                <CircularProgress style={styled} /> // MUI Loader when isLoading is true and list has no data
            ) : !isLoading && list.length === 0 ? (
                <p style={styled} >No record found</p> // Display "No record found" when isLoading is false and list has no data
            ) : (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <div style={{ flex: 1 }}>
                        <span style={{ marginRight: '10px' }}>Records per page</span>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={rowsPerPage}
                                onChange={handleChangeRowsPerPage}
                                size="small"
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center' }}>
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
