import { DataGrid } from '@mui/x-data-grid';
import { confirmToastInterface, tableInterfaceData } from '../../Functions/interfaces';
import { ToastOptions, toast } from 'react-toastify';

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

 const ConfirmationToast = ({ onConfirm, onCancel }: confirmToastInterface) => (
    <div>
        <p>Are you sure you want to proceed?</p>
        <button onClick={onConfirm}>Yes</button>
        <button className='ml-3' onClick={onCancel}>No</button>
    </div>
);

export const showConfirmationToast = (onConfirm: any) => {
    const onCancel = () => toast.dismiss();
    const toastOptions: ToastOptions = {
        autoClose: false
    };
    toast(<ConfirmationToast onConfirm={onConfirm} onCancel={onCancel} />, toastOptions);
};