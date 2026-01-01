import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import SlideBar from "../components/Sidebar";

export default function Index() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const stored = sessionStorage.getItem("userSession");
        if (!stored) navigate("/login?itsec-token=admin", { replace: true });
    }, []);

    useEffect(() => {
        const path = location.pathname.toString().split("/page/")[1] || "home";
        
        document.title = `${path.charAt(0).toUpperCase() + path.slice(1)}`;
    }, [location]);

    return (
        <>
            <SlideBar />
            <div className="ml-64">
                <Outlet />
            </div>
        </>
    );
}