import React, { Suspense } from "react";
import { List, Page, Icon, useNavigate } from "zmp-ui";
import UserCard from "../components/user-card";
import Home from "../components/Admin/Home/Home";
import "./index.scss"

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <Page className="page">
      <Suspense>
        <div className="section-container">
          <Home />
        </div>
      </Suspense>

    </Page>
  );
};

export default HomePage;
