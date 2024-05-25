import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { tableInterfaceData } from '../../Functions/interfaces';
import { toast } from 'react-toastify';

export function DataTable({ rowsData, columnsData }: tableInterfaceData) {
    rowsData.forEach((item, idx) => item.id = idx + 1)
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rowsData}
                columns={columnsData}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
            />
        </div>
    );
}

export const toastifyHelperData = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
}