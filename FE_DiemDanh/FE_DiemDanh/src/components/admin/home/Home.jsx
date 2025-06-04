import React, { useEffect, useState } from "react";
import { BottomNavigation, Icon, Page } from "zmp-ui";
import TeacherTable from "../TeacherTable/TeacherTable";
//import ClassTable from "../ClassTable.jsx";
import SubjectTable from "../SubjectTable/SubjectTable";
import StudentTable from "../StudentTable/StudentTable";
import Account from "../../Account/Account";
import DiemDanhAdmin from "../diem-danh/DiemDanh";



const HomeAdmin = () => {
    const [activeTab, setActiveTab] = useState("teacher");
    useEffect(() => {
        if (localStorage.getItem("title")) {
            setActiveTab(localStorage.getItem("title"))
        }
    }, [])

    const handlOnChangeNavigate = (key) => {
        localStorage.setItem("title", key)
        setActiveTab(key)
    }

    return (

        <Page>

            {activeTab === "teacher" && <TeacherTable />}
            {activeTab === "class" && <ClassTable />}
            {activeTab === "subject" && <SubjectTable />}
            {activeTab === "student" && <StudentTable />}
            {activeTab === "account" && <Account />}
            {activeTab === "diem-danh" && <DiemDanhAdmin />}



            <BottomNavigation
                fixed
                activeKey={activeTab}
                onChange={(key) => handlOnChangeNavigate(key)}
            >
                <BottomNavigation.Item
                    key="teacher"
                    label="Giảng viên"
                    icon={<Icon icon="zi-switch-users" />}
                    activeIcon={<Icon icon="zi-switch-users-solid" />}
                />
                <BottomNavigation.Item
                    label="Lớp"
                    key="class"
                    icon={<Icon icon="zi-create-group" />}
                    activeIcon={<Icon icon="zi-create-group-solid" />}
                />
                <BottomNavigation.Item
                    label="Môn học"
                    key="subject"
                    icon={<Icon icon="zi-more-grid" />}
                    activeIcon={<Icon icon="zi-more-grid-solid" />}
                />
                <BottomNavigation.Item
                    key="student"
                    label="Sinh viên"
                    icon={<Icon icon="zi-user" />}
                    activeIcon={<Icon icon="zi-user-solid" />}
                />
                <BottomNavigation.Item
                    key="diem-danh"
                    label="Điểm danh"
                    icon={<Icon icon="zi-user" />}
                    activeIcon={<Icon icon="zi-user-solid" />}
                />
                <BottomNavigation.Item
                    key="account"
                    label="Tài khoản"
                    icon={<Icon icon="zi-user" />}
                    activeIcon={<Icon icon="zi-user-solid" />}
                />


            </BottomNavigation>
        </Page>
    )
}

export default HomeAdmin

