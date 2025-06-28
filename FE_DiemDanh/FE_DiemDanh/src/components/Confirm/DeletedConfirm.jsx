import { useEffect } from "react";
import { Box, Page } from "zmp-ui"
import { Modal, Button } from "zmp-ui";

const DeletedConfirm = ({ isOpen, handleClose, handleDelete, text }) => {
    useEffect(()=>{
        console.log("Văn Đình Thuật");
        
    }, [])
    return (
        <Box>
            <Modal
                visible={isOpen}
                title="Xác nhận xóa"
                description={text}
                actions={[
                    { text: "Hủy", close: true },
                    { text: "Xóa", close: false, danger: true, onClick: () => {
                        handleDelete();
                    }}
                ]}
            onClose={handleClose}
            />
        </Box>
    )
}

export default DeletedConfirm