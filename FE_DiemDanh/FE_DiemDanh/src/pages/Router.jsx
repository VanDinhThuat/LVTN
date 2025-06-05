import { AnimationRoutes, ZMPRouter } from "zmp-ui";
import { Route } from "react-router-dom";
//import HomeAdmin from "../components/Admin/Home/Home";
import HomeAdmin from "../components/admin/home/Home";
import TeacherProfile from "../components/admin/TeacherProfile/TeacherProfile";
import StudentProfile from "../components/admin/StudentProflie/StudentProfile";
import TeacherHome from "../components/teacher/TeacherHome/TeacherHome";
import GroupDetails from "../components/teacher/GroupDetails/GroupDetails";
import UserDetails from "../components/UserDetails/UserDetails";
import Login from "../components/Login/Login";
import ForgetPassword from "../components/ForgetPassword/ForgetPassword";
import CreateSubject from "../components/admin/CreateSubject/CreateSubject";
import CreateClass from "../components/admin/CreateClass/CreateClass";
import CreateStudent from "../components/admin/CreateStudent/CreateStudent";
import CreateSession from "../components/teacher/CreateSession/CreateSession";
import StudentHome from "../components/student/StudentHome";
import QrCode from "../components/teacher/QrCode/QrCode";
import SubjectDetails from "../components/admin/SubjectDetails/SubjectDetails";
import CreateTeacher from "../components/admin/CreateTeacher/CreateTeacher";
import ClassDetails from "../components/admin/ClassDetails/ClassDetails";
import ChangePassword from "../components/ChangPassword/ChangePassword";
import DiemDanhList from "../components/DiemDanhList/DiemDanhList";
import ThongBao from "../components/ThongBao/ThongBao";
import DiemDanh from "../components/teacher/diem-danh/DiemDanh";
import DiemDanhDetails from "../components/teacher/DiemDanhDetails/DiemDanhDetails";
import Account from "../components/Account/Account";
//import DiemDanhAdmin from "../components/Admin/diem-danh/DiemDanh";
import DiemDanhAdmin from "../components/admin/diem-danh/DiemDanh";
import CreateProject from "../components/teacher/createproject/createproject"; 
import TuanNopBaiList from "../components/teacher/TuanNopBaiList/TuanNopBaiList";
import CreateTuanNopBai from "../components/teacher/CreateTuanNopBai/CreateTuanNopBai";
import "./index.scss"
import NopBaiPage from "../components/teacher/Nopbaipage/Nopbaipage";
import QuanLyNopBaiPage from "../components/teacher/QuanLyNopBaiPage/QuanLyNopBaiPage";
import ChiTietBaiNopPage from "../components/student/ChiTietBaiNopPage/ChiTietBaiNopPage";

const Router = () => {
    return (
        <ZMPRouter>
            <AnimationRoutes>
                <Route path="/*" element={<Login />}></Route>

                <Route path="/teacherProfile" element={<TeacherProfile />}></Route>
                <Route path="/studentProfile" element={<StudentProfile />}></Route>
                <Route path="/admin" element={<HomeAdmin/>}></Route>
                <Route path="/teacher/group" element={<GroupDetails />}></Route>
                <Route path="/user" element={<UserDetails />}></Route>
                <Route path="/teacher" element={<TeacherHome />}></Route>
                <Route path="/forget-password" element={<ForgetPassword />}></Route>
                <Route path="/create-subject" element={<CreateSubject />}></Route>
                <Route path="/create-class" element={<CreateClass />}></Route>
                <Route path="/create-student" element={<CreateStudent />}></Route>
                <Route path="/create-session" element={<CreateSession />}></Route>
                <Route path="/student" element={<StudentHome />}></Route>
                <Route path="/create-qrcode" element={<QrCode />}></Route>
                <Route path="/student" element={<StudentHome />}></Route>
                <Route path="/class-details" element={<ClassDetails />}></Route>
                <Route path="/subject-details" element={<SubjectDetails />}></Route>
                <Route path="/create-teacher" element={<CreateTeacher />}></Route>
                <Route path="/change-pass" element={<ChangePassword />}></Route>
                <Route path="/list-diem-danh" element={<DiemDanhList />}></Route>
                <Route path="/thanh-cong" element={<ThongBao />}></Route>
                <Route path="/xem-diem-danh" element={<DiemDanh />}></Route>
                <Route path="/account" element={<Account />}></Route>
                <Route path="/admin-diem-danh" element={<DiemDanhAdmin />}></Route>

                <Route path="/diemdanh-chitiet" element={<DiemDanhDetails />}></Route>
                <Route path="/createproject" element={<CreateProject />}></Route>
                <Route path="/tuan-nop-bai" element={<TuanNopBaiList />} />
                <Route path="/create-tuan-nop-bai" element={<CreateTuanNopBai />} />
                <Route path="/nop-bai" element={<NopBaiPage />} />
                <Route path="/quan-ly-nop-bai" element={<QuanLyNopBaiPage />} />
                <Route path="/tuan-nop-bai-detail-sinhvien" element={<ChiTietBaiNopPage />} />






            </AnimationRoutes>
        </ZMPRouter>
    );
};

export default Router;
