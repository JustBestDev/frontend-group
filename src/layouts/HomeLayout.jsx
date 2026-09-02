import { Outlet } from "react-router";
import HeaderComponent from "../components/HeaderComponent.jsx";


const HomeLayout = () => {
  return (
    <>
      <HeaderComponent />
      <Outlet />
    </>
  );
};

export default HomeLayout;
