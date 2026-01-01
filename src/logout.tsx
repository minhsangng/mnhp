import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem("userSession");
        navigate("/login?itsec-token=admin", { replace: true });
    }, []);

    return (<></>);
}