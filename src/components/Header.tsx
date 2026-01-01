import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "../assets/images/logo_hoz_full.svg";

export default function Header() {
  const [openNav, setOpenNav] = useState(false);

  return (
    <header className="w-full z-1">
      <div className="max-w-screen mx-auto p-4">
        <nav className="flex! items-center! justify-between!">
          <a href="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-20" />
          </a>

          <ul className="hidden lg:flex items-center gap-2 m-0!">
            <li className="hover:bg-[#252525] transition px-4 py-2 rounded-lg">
              <a
                href="/#home"
                className="text-lg font-medium text-white uppercase"
              >
                Trang chủ
              </a>
            </li>
            <li className="hover:bg-[#252525] transition px-4 py-2 rounded-lg">
              <a
                href="#furniture"
                className="text-lg font-medium text-white uppercase "
              >
                Cơ sở vật chất
              </a>
            </li>
            <li className="hover:bg-[#252525] transition px-4 py-2 rounded-lg">
              <a
                href="#activity"
                className="text-lg font-medium text-white uppercase"
              >
                Hoạt động
              </a>
            </li>
            <li className="hover:bg-[#252525] transition px-4 py-2 rounded-lg">
              <a
                href="#team"
                className="text-lg font-medium text-white uppercase"
              >
                Giáo viên
              </a>
            </li>
            <li className="hover:bg-[#252525] transition px-4 py-2 rounded-lg">
              <a
                href="#about"
                className="text-lg font-medium text-white uppercase"
              >
                Giới thiệu
              </a>
            </li>
            <li className="hover:bg-[#252525] transition px-4 py-2 rounded-lg">
              <a
                href="#contact"
                className="text-lg font-medium text-white uppercase"
              >
                Liên hệ
              </a>
            </li>
          </ul>

          <div className="hidden lg:block relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              className="pl-10 pr-4 py-2 rounded-full text-gray-600! bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <button className="lg:hidden p-2 rounded-md hover:bg-gray-100" onClick={()=> setOpenNav(!openNav)}>
            <Menu  className="w-8 h-8" style={openNav ? {display: "none"} : {display: "block"}} />
            <X  className="w-8 h-8" style={!openNav ? {display: "none"} : {display: "block"}} />
          </button>

          <div className="lg:hidden absolute top-20 right-4 w-1/2 bg-(--bg-opacity) z-50" style={!openNav ? {display: "none"} : {display: "block"}}>
            <ul className="flex flex-col items-end gap-1 m-0!">
              <li className="shadow-xs-(--bg) w-full text-right pr-4 py-2">
                <a
                  href="/#home"
                  className="text-lg font-medium text-white uppercase"
                >
                  Trang chủ
                </a>
              </li>
              <li className="shadow-xs-(--bg) w-full text-right pr-4 py-2">
                <a
                  href="#furniture"
                  className="text-lg font-medium text-white uppercase "
                >
                  Cơ sở vật chất
                </a>
              </li>
              <li className="shadow-xs-(--bg) w-full text-right pr-4 py-2">
                <a
                  href="#activity"
                  className="text-lg font-medium text-white uppercase"
                >
                  Hoạt động
                </a>
              </li>
              <li className="shadow-xs-(--bg) w-full text-right pr-4 py-2">
                <a
                  href="#team"
                  className="text-lg font-medium text-white uppercase"
                >
                  Giáo viên
                </a>
              </li>
              <li className="shadow-xs-(--bg) w-full text-right pr-4 py-2">
                <a
                  href="#about"
                  className="text-lg font-medium text-white uppercase"
                >
                  Giới thiệu
                </a>
              </li>
              <li className="shadow-xs-(--bg) w-full text-right pr-4 py-2">
                <a
                  href="#contact"
                  className="text-lg font-medium text-white uppercase"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
