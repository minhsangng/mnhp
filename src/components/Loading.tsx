import logo from "../assets/images/favicon.svg";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="h-[8vw] w-[8vw] mb-6">
        <img src={logo} alt="Logo" className="h-full w-full" />
      </div>

      <div className="flex space-x-2">
        <span className="w-[0.75vw] h-[0.75vw] bg-(--bg) rounded-full animate-bounce delay-0"></span>
        <span className="w-[0.75vw] h-[0.75vw] bg-(--bg) rounded-full animate-bounce delay-200"></span>
        <span className="w-[0.75vw] h-[0.75vw] bg-(--bg) rounded-full animate-bounce delay-400"></span>
        <span className="w-[0.75vw] h-[0.75vw] bg-(--bg) rounded-full animate-bounce delay-600"></span>
      </div>
    </div>
  );
}
