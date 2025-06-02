import { Page } from "zmp-ui"
import { Modal, Button } from "zmp-ui";

const DeletedTeacherConfirmModal = ({isOpen, handleClose, handleDelete}) => {

    return (

        <Page>
            <Modal
                visible={isOpen}
                title="Xác nhận xóa"
                description="Bạn có chắc chắn muốn xóa giảng viên này không?"
                actions={[
                    { text: "Hủy", close: true },
                    { text: "Xóa", close: true, danger: true, onClick: () => handleDelete() }
                ]}
                onClose={handleClose}
            />
        </Page>
    )
}

export default DeletedTeacherConfirmModal