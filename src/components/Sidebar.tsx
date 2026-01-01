import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo_hoz_full.svg";
import { CircleGauge, IdCardLanyard, Baby, FileDown, FileUp, LogOut } from "lucide-react";

export default function SideBar() {
    const location = useLocation();

    const menuItems = [
        { name: "Tổng quan", path: "/page", icon: <CircleGauge size={20} color="var(--primary-color)" /> },
        { name: "Quản lý giáo viên", path: "/page/employee", icon: <IdCardLanyard  size={20} color="var(--primary-color)" /> },
        { name: "Quản lý học sinh", path: "/page/children", icon: <Baby size={20} color="var(--primary-color)" /> },
        { name: "Nhập báo cáo", path: "/page/import", icon: <FileDown size={20} color="var(--primary-color)" /> },
        { name: "Xuất báo cáo", path: "/page/export", icon: <FileUp size={20} color="var(--primary-color)" /> },
    ];

    return (
        <div className="fixed top-0 left-0 w-64 h-full border-r border-(--border) shadow">
            <Link to="/page" className="bg-(--primary-color) flex justify-center">
                <img src={logo} alt="Logo" className="w-52" />
            </Link>
            <ul className="mt-4!">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <li
                            key={item.path}
                            className={`px-6 py-2 hover:bg-amber-100 flex items-center gap-2 ${isActive ? "bg-amber-100 underline" : ""}`}
                        >
                            {item.icon}
                            <Link className="text-(--primary-color) text-lg" to={item.path}>
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
                <li className="border-t border-(--border) mt-8 px-6 py-2 hover:bg-amber-100 bg-slate-100 flex items-center gap-2"><LogOut size={20} color="var(--primary-color)" /><Link className="text-(--primary-color) text-lg" to="../logout">Đăng xuất</Link></li>
            </ul>
        </div>
    );
}