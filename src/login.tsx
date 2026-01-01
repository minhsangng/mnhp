/* eslint-disable react-hooks/purity */
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { User, LockKeyhole } from "lucide-react";
import CryptoJS from "crypto-js";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const leavesRef = useRef<HTMLDivElement>(null);

  const Leaf = ({ style }: { style: React.CSSProperties }) => (
    <svg
      viewBox="0 0 64 64"
      className="absolute opacity-40"
      style={style}
    >
      <path
        d="M32 2
         C20 14 10 28 12 42
         C14 56 28 62 32 62
         C36 62 50 56 52 42
         C54 28 44 14 32 2Z"
        fill="var(--accent)"
      />
      <path
        d="M32 2 L32 62"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />
    </svg>
  );

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hashPassword = CryptoJS.SHA256(password).toString();

    if (!username || !password) {
      alert("Vui lòng điền đầy đủ thông tin đăng nhập.");
    } else {
      if (username === import.meta.env.VITE_USERNAME && hashPassword === import.meta.env.VITE_PASSWORD) {
        const userSession = {
          isLoggedIn: true,
          username: username,
        };
        sessionStorage.setItem("userSession", JSON.stringify(userSession));
        navigate("/page", { replace: true });
      } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng.");
      }
    }
  }

  useEffect(() => {
    document.title = "ĐĂNG NHẬP HỆ THỐNG";

    const token = searchParams.get("itsec-token");

    if (token !== "admin") {
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (!leavesRef.current) return;
      leavesRef.current.style.transform = `translateY(${window.scrollY * 0.25}px)`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const leaves = useMemo(() => {
    return Array.from({ length: 12 }).map(() => {
      const size = 20 + Math.random() * 30;
      const duration = 12 + Math.random() * 10;
      const delay = Math.random() * 5;
      const left = Math.random() * 100;
      const top = -Math.random() * 100;

      return { size, duration, delay, left, top };
    });
  }, []);


  return (
    <div className="bg-(--bg) h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
      <div ref={leavesRef} className="absolute inset-0 pointer-events-none">
        {leaves.map((leaf, i) => (
          <Leaf
            key={i}
            style={{
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              left: `${leaf.left}%`,
              top: `${leaf.top}px`,
              animation: `leaf-fall ${leaf.duration}s linear infinite`,
              animationDelay: `${leaf.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="w-1/3 rounded p-4 border border-(--text-secondary)">
        <form onSubmit={handleLogin} className="border border-(--text-secondary)">
          <h2 className="bg-(--primary-color) text-2xl px-6 py-3">Đăng nhập hệ thống</h2>
          <div className="pt-10 py-2 px-4 border boder-(--border)">
            <div className="w-full flex border border-(--text-secondary) relative mb-4">
              <User className="p-2 border border-r-(--text-color) bg-(--secondary-color)" color="var(--text-color)" size={44} />
              <input className="w-full outline-0 px-4 text-(--text-color)/85!" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="w-full flex border border-(--text-secondary) relative mb-4">
              <LockKeyhole className="p-2 border border-r-(--text-color) bg-(--secondary-color)" color="var(--text-color)" size={44} />
              <input className="w-full outline-0 px-4 text-(--text-color)/85!" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <a href="#" className="text-right block text-(--text-secondary) italic underline">Quên mật khẩu?</a>

          </div>
          <div className="bg-slate-100 py-3 px-4 text-center border-t border-(--text-secondary)">
            <button type="submit" className="bg-(--text-secondary)/75 hover:bg-(--text-secondary) focus:bg-(--text-secondary) text-xl! px-8 py-1 rounded cursor-pointer">Đăng nhập</button>
          </div>
        </form>
      </div>
      <p className="text-gray-400 py-8 m-0!">hoặc</p>
      <p className="text-(--text-color) m-0!">Quay lại <a href="/" className="underline text-(--primary-color)">Trang chủ</a></p>
    </div>
  );
}