import React, { useState } from "react";
import { BottomNavigation, Icon, Page } from "zmp-ui";
import StudentGroup from "../StudentGroup/StudentGroup";
import UserDetails from "../../UserDetails/UserDetails";
import Account from "../../Account/Account";
import ProjectClassManager from "../ProjectClassManager/ProjectClassManager";
import CreateProject from "../createproject/createproject";
import TuanNopBaiList from "../TuanNopBaiList/TuanNopBaiList";


const TeacherHome = () => {
    const [activeTab, setActiveTab] = useState("group");


    const handlOnChangeNavigate = (key) => {
        setActiveTab(key)        
    }

    return (

        <Page>

           {activeTab === "group" && <StudentGroup />}
           {activeTab === "account" && <Account />}
           {activeTab === "classmanager" && <ProjectClassManager />}


            <BottomNavigation
                fixed
                activeKey={activeTab}
                onChange={(key) => handlOnChangeNavigate(key)}
            >
                <BottomNavigation.Item
                    key="group"
                    label="Nhóm học"
                    icon={<Icon icon="zi-group" />}
                    activeIcon={<Icon icon="zi-group-solid" />}
                />
               
                
                <BottomNavigation.Item
                    key="account"
                    label="Tài khoản"
                    icon={<Icon icon="zi-user" />}
                    activeIcon={<Icon icon="zi-user-solid" />}
                />
                <BottomNavigation.Item
                    key="classmanager"
                    label="Quản lí đồ án"
                    icon={<Icon icon="zi-user" />}
                    activeIcon={<Icon icon="zi-user-solid" />}
                />
            </BottomNavigation>
        </Page>
    )
}

export default TeacherHome

