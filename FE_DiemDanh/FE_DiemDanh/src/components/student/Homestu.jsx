import React, { useState } from "react";
import { BottomNavigation, Icon, Page } from "zmp-ui";


import Account from "../Account/Account";
import StudentHome from "./StudentHome";


const TeacherHome = () => {
    const [activeTab, setActiveTab] = useState("group");


    const handlOnChangeNavigate = (key) => {
        setActiveTab(key)        
    }

    return (

        <Page header={{ title: "My App", leftButton: "none" }}>

           {activeTab === "group" && <StudentHome />}
            {activeTab === "account" && <Account />}
         


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
              
            </BottomNavigation>
        </Page>
    )
}

export default TeacherHome

