import logo from "../assets/images/logo_hoz.svg";
import bg from "../assets/images/footer_bg.png";
import { PhoneCall, MapPinHouse } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative px-8 pt-24 pb-2 bg-no-repeat bg-bottom-left bg-auto flex" style={{backgroundImage: `url(${bg})`}}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute top-0 left-0 w-full h-20 scale-y-[-1]"
      >
        {/* shadow stroke */}
        <path
          d="M0,40 C120,20 240,60 360,40 480,20 600,60 720,40 840,20 960,60 1080,40 1200,20 1320,60 1440,40"
          fill="none"
          stroke="rgba(138,186,222,0.45)"
          strokeWidth="6"
          filter="url(#blur)"
        />

        {/* main wave */}
        <path
          d="M0,40 C120,20 240,60 360,40 480,20 600,60 720,40 840,20 960,60 1080,40 1200,20 1320,60 1440,40 L1440,0 L0,0 Z"
          fill="var(--bg)"
        />

        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="1" />
          </filter>
        </defs>
      </svg>

      <div className="w-1/2 hidden md:block"></div>

      <div className="md:w-1/2 w-full">
        <div className="bg-linear-to-r from-blue-500/75 to-blue-900 p-1 rounded-3xl">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 w-full py-4 pl-4 pr-4 border border-gray-300 border-dashed rounded-3xl bg-(--bg-opacity)">
              <img src={logo} alt="Logo" className="w-full mb-3" />
              <div className="flex gap-3 items-center mb-1">
                <PhoneCall size={16} className="text-gray-200" />
                <p className="m-0! text-sm text-gray-200">0843363639 (cô Vân)</p>
              </div>
              <div className="flex gap-3 items-center">
                <MapPinHouse size={16} className="text-gray-200" />
                <p className="m-0! text-sm text-gray-200">Lộ Vàm, Chợ Gạo, Đồng Tháp</p>
              </div>
            </div>
            <div className="md:w-2/3 w-full border border-gray-300 border-dashed rounded-3xl bg-(--bg-opacity)">
              <p className="py-4 px-6 text-justify text-xl">Chúng tôi tin rằng mỗi đứa trẻ đều mang trong mình một hạt mầm kỳ diệu. Với sự yêu thương, tận tâm và môi trường học tập an toàn, <span className="text-gray-700 bg-(--bg) px-2 pt-2 rounded-sm uppercase drop-shadow-xs drop-shadow-white">Mầm non Hồng Phúc</span> sẽ đồng hành cùng con trên những bước chân đầu đời, nuôi dưỡng nhân cách và chắp cánh cho tương lai.</p>
            </div>
          </div>
        </div>
        <p className="mt-6! mb-0! md:text-base text-xs text-center text-gray-300">&copy; Bản quyền thuộc về <span className="underline underline-offset-2 text-white italic">Mầm non Hồng Phúc</span> | Design by <a href="https://github.com/minhsangng" className="underline underline-offset-2 text-white italic">minhsang</a>.</p>
      </div>
    </footer>
  );
}

export default Footer;
