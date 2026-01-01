import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import Logout from "./logout";
import Index from "./pages/index";
import Dashboard from "./pages/dashboard";
import Employee from "./pages/employee";
import Children from "./pages/children";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

import { ArrowLeft, ArrowRight, ArrowUp, Play, ChefHat, Drum, Medal, ChevronLeft, ChevronRight } from "lucide-react";

import img from "./assets/images/bg.png";

const slides = [1, 2, 3];

function Main() {
  const [current, setCurrent] = useState(0);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false)

  const teachers = [
    {
      name: "Cô Nguyễn Thị Hồng",
      role: "Giáo viên chủ nhiệm",
      desc: "Có hơn 10 năm kinh nghiệm trong việc chăm sóc và giáo dục trẻ mầm non, luôn tận tâm và yêu thương trẻ.",
      img: "../src/assets/images/client-img1.png",
    },
    {
      name: "Cô Trần Thị Phúc",
      role: "Giáo viên mầm non",
      desc: "Chuyên xây dựng các hoạt động học tập sáng tạo, giúp trẻ phát triển tư duy và kỹ năng xã hội.",
      img: "../src/assets/images/client-img2.png",
    },
    {
      name: "Cô Lê Thị Mai",
      role: "Giáo viên năng khiếu",
      desc: "Phụ trách các lớp vẽ, âm nhạc và vận động, tạo môi trường học tập vui vẻ và năng động cho trẻ.",
      img: "../src/assets/images/client-img1.png",
    },
    {
      name: "Cô Phạm Thị Lan",
      role: "Giáo viên chăm sóc",
      desc: "Luôn quan tâm đến dinh dưỡng, sức khỏe và sinh hoạt hằng ngày của trẻ tại trường.",
      img: "../src/assets/images/client-img2.png",
    },
  ];

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const itemsPerSlide = 2;
  const maxIndex = Math.ceil(teachers.length / itemsPerSlide) - 1;

  const scrollToTop = () => {
    const start = window.scrollY;
    const duration = 200;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo(0, start * (1 - progress));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  useEffect(() => {
    document.title = "MẦM NON HỒNG PHÚC";

    const onScroll = () => {
      setVisible(window.scrollY > 300);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(timer);
  }, [maxIndex]);

  return (
    <>
      {/* Banner Section */}
      <section className="pb-12 pt-4">
        <div className="relative w-full overflow-hidden">

          {/* Slides wrapper */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((_, index) => (
              <div
                key={index}
                className="min-w-full px-4 relative"
              >
                {/* Nội dung slide */}
                <div className="md:flex">
                  <div className="relative h-full md:w-1/6 pr-4 overflow-visible">
                    <h1 className="md:absolute -left-24 top-48 whitespace-nowrap md:text-4xl/24 text-xl/14 font-bold uppercase md:-rotate-90 ">
                      Trường Mầm non <br />
                      <span className="text-gray-700 md:text-[6rem] text-6xl">HỒNG PHÚC</span>
                    </h1>
                  </div>

                  <div className="md:w-5/6 sm:w-full bg-(--bg-opacity) py-3 px-4 rounded-xl">
                    <div className="md:flex sm:flex-col gap-1 justify-center">
                      <img
                        src={img}
                        alt=""
                        className="md:w-1/2 sm:w-full sm:h-92! object-cover rounded-xl md:h-144"
                      />
                      <img
                        src={img}
                        alt=""
                        className="md:w-1/2 sm:w-full sm:h-92! object-cover rounded-xl md:h-144"
                      />
                    </div>
                  </div>
                </div>

                {/* Controls trong slide */}
                <button
                  onClick={prevSlide}
                  className="absolute md:left-[58.2%] left-[50%] md:top-[45%] top-[55%] -translate-x-1/2 -translate-y-1/2 bg-(--bg-button) hover:bg-(--bg-button) p-2 shadow rounded-full cursor-pointer transition"
                >
                  <ArrowLeft className="w-6 h-6 size-8! text-white" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute md:left-[58.2%] left-[50%] md:top-[55%] top-[68%] -translate-x-1/2 -translate-y-1/2 bg-white hover:bg-(--bg-button) group p-2 shadow rounded-full cursor-pointer transition"
                >
                  <ArrowRight className="w-6 h-6 size-8! text-black group-hover:text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Furnitures Section */}
      <section className="py-12" id="furniture">
        <div className="max-w-7xl mx-auto px-4">

          <h1 className="md:text-4xl text-3xl font-bold text-gray-700 text-center uppercase mb-4">
            Cơ sở <span className="text-white"> vật chất</span>
          </h1>

          <p className="text-gray-200 text-center max-w-2xl mx-auto mb-10">Được trang bị đầy đủ dụng cụ học tập, vui chơi, giải trí để bé có thể phát triển</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="relative group overflow-hidden rounded-xl">
              <img src="../src/assets/images/img-2.png" alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-600" />
            </div>

            <div className="flex flex-col gap-6">
              <div className="relative group overflow-hidden rounded-xl">
                <img src="../src/assets/images/img-2.png" alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-600" />
              </div>

              <div className="relative group overflow-hidden rounded-xl">
                <img src="../src/assets/images/img-2.png" alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-600" />
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl">
              <img src="../src/assets/images/img-2.png" alt="" className="w-full h-full object-cover group-hover:scale-110 transition duration-600" />
            </div>

          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-12" id="activity">
        <div className="max-w-7xl mx-auto px-4">

          <div className="text-center mb-12">
            <h1 className="md:text-4xl text-3xl font-bold text-gray-700 uppercase mb-2">
              Hoạt động <span className="text-white">Trải nghiệm</span>
            </h1>
            <p className="text-gray-200">
              Trường luôn tổ chức các hoạt động trải nghiệm thường xuyên giúp trẻ phát triển toàn diện
            </p>
          </div>

          {/* Section 1 */}
          <div className="relative flex flex-col md:flex-row items-center mb-16">
            <div className="md:w-1/2 flex justify-end border-r pr-16">
              <img
                src="../src/assets/images/img-3.png"
                alt=""
                className="w-[30vw] h-72 rounded-sm bg-(--bg-opacity) p-6"
              />
            </div>

            <div className="md:w-1/2 border-l border-hidden h-full! pl-16">
              <h3 className="text-3xl font-bold text-white mb-4">
                Ca - <span className="text-gray-600">múa - </span> nhạc
              </h3>
              <p className="text-gray-200 mb-6 leading-relaxed text-justify">
                Hoạt động ca - múa - nhạc mang đến cho trẻ không gian vui tươi để thể hiện cảm xúc và năng khiếu nghệ thuật của bản thân. Thông qua những giai điệu quen thuộc, các động tác múa sinh động và nhịp điệu rộn ràng, trẻ được rèn luyện sự tự tin, khả năng cảm thụ âm nhạc và phối hợp vận động. Đây cũng là dịp để các bé mạnh dạn thể hiện mình trước tập thể, nuôi dưỡng tâm hồn trong sáng và tình yêu đối với nghệ thuật ngay từ những năm đầu đời.
              </p>
            </div>

            <Drum className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_4px_var(--bg-button)] size-12" />
          </div>

          {/* Section 2 */}
          <div className="relative flex flex-col md:flex-row items-center mb-16">
            <div className="md:w-1/2 order-2 md:order-1 pr-16 border-r border-hidden">
              <h3 className="text-3xl font-bold text-white mb-4">
                Nhập vai <span className="text-gray-600">nghề nghiệp</span>
              </h3>
              <p className="text-gray-200 mb-6 leading-relaxed text-justify">
                Hoạt động nhập vai nghề nghiệp giúp trẻ làm quen với thế giới xung quanh thông qua những vai diễn gần gũi như bác sĩ, đầu bếp, cô giáo, chú công an… Trong quá trình nhập vai, các bé được tự do tưởng tượng, giao tiếp và phối hợp cùng bạn bè, từ đó phát triển kỹ năng ngôn ngữ, tư duy sáng tạo và khả năng giải quyết tình huống. Hoạt động này không chỉ mang lại niềm vui mà còn giúp trẻ hiểu hơn về các nghề nghiệp trong xã hội, hình thành những ước mơ đầu đời một cách tự nhiên và hồn nhiên.
              </p>
            </div>

            <div className="md:w-1/2 order-1 md:order-2 border-l pl-16">
              <img
                src="../src/assets/images/img-3.png"
                alt=""
                className="w-[30vw] h-72 rounded-sm bg-(--bg-opacity) p-6"
              />
            </div>

            <ChefHat className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_4px_var(--bg-button)] size-12" />
          </div>

          {/* Section 3 */}
          <div className="relative flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 flex justify-end border-r pr-16">
              <img
                src="../src/assets/images/img-3.png"
                alt=""
                className="w-[30vw] h-72 rounded-sm bg-(--bg-opacity) p-6"
              />
            </div>

            <div className="md:w-1/2 pl-16 border-l border-hidden">
              <h3 className="text-3xl font-bold text-white mb-4">
                Thi đấu <span className="text-gray-600">tranh tài</span>
              </h3>
              <p className="text-gray-200 mb-6 leading-relaxed text-jsutify">
                Hoạt động thi đua - tranh tài tại trường mầm non được thiết kế nhẹ nhàng, vui tươi và phù hợp với lứa tuổi, nhằm giúp các bé rèn luyện thể chất, phát triển kỹ năng vận động và tinh thần hợp tác. Thông qua các trò chơi vận động, hội thi nhỏ và hoạt động nhóm, trẻ được khuyến khích mạnh dạn tham gia, tự tin thể hiện bản thân và học cách chia sẻ, cổ vũ bạn bè. Mỗi hoạt động đều đặt niềm vui và sự an toàn của trẻ lên hàng đầu, giúp các bé vừa học vừa chơi trong một môi trường tích cực và đầy hứng khởi.
              </p>
            </div>

            <Medal className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_4px_4px_var(--bg-button)] size-12" />
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="relative overflow-hidden bg-white py-12" id="team">
        <h3 className="md:text-4xl text-3xl font-bold text-gray-700 uppercase mb-12 md:pl-30 md:text-left text-center">
          Đội ngũ <span className="text-white bg-(--bg-button) px-4 pt-2">Giáo viên</span>
        </h3>

        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {Array.from({ length: maxIndex + 1 }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:px-30 px-6">
                {teachers
                  .slice(
                    slideIndex * itemsPerSlide,
                    slideIndex * itemsPerSlide + itemsPerSlide
                  )
                  .map((teacher, i) => (
                    <div key={i} className="md:flex gap-6 items-start">
                      <img
                        src={teacher.img}
                        className="w-44 h-32 object-cover bg-(--bg-opacity) py-2 px-4 rounded-xs"
                      />
                      <div>
                        <div className="md:flex flex-col">
                          <h3 className="text-xl font-semibold text-(--primary-color)">
                          {teacher.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {teacher.role}
                        </p>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                          {teacher.desc}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIndex(index === 0 ? maxIndex : index - 1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-3 text-white hover:scale-110 transition"
        >
          <ChevronLeft size={32} color="var(--primary-color)" />
        </button>

        <button
          onClick={() => setIndex(index === maxIndex ? 0 : index + 1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-3 text-white hover:scale-110 transition"
        >
          <ChevronRight size={32} color="var(--primary-color)" />
        </button>
      </section>

      {/* About Section */}
      <section className="py-12" id="about">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">

            <div className="md:w-1/2 pr-8">
              <h2 className="md:text-4xl text-3xl font-exrabold text-gray-700 uppercase mb-4">
                Giới thiệu <span className="text-white">Hồng Phúc</span>
              </h2>

              <p className="text-gray-100 leading-relaxed mb-6 text-lg indent-6 text-justify">
                Trường Mầm Non Hồng Phúc được thành lập với mong muốn góp phần xây dựng một môi trường giáo dục sớm chất lượng cho trẻ em địa phương. Trải qua quá trình hình thành và phát triển, nhà trường không ngừng hoàn thiện cơ sở vật chất, chương trình chăm sóc – giáo dục và đội ngũ nhân sự để đáp ứng nhu cầu ngày càng cao của phụ huynh. Từ những ngày đầu còn nhiều khó khăn, Hồng Phúc từng bước khẳng định uy tín bằng sự tận tâm, trách nhiệm và niềm tin yêu của phụ huynh, trở thành nơi gửi gắm tuổi thơ của nhiều thế hệ mầm non.
              </p>

              <div
                className="relative w-18 h-18 mt-12 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer transition group 
                            after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-white after:opacity-30 after:animate-ping
                            before:content-[''] before:absolute before:-inset-1 before:rounded-full before:bg-white before:opacity-30 before:animate-ping delay-300"
              >
                <Play className="w-8 h-8 text-white relative z-10 group-hover:scale-105" />
              </div>
            </div>

            <div className="relative md:w-1/2 flex justify-center">
              <img
                src={img}
                alt="About"
                className="max-w-full h-auto shadow-lg rounded-xs"
              />
              <div className="absolute -z-1 bg-(--bg-opacity) -bottom-4 -left-4 w-52 h-42"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12" id="contact">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="md:text-4xl text-3xl font-bold text-gray-700 text-center uppercase mb-16">
            Liên hệ <span className="text-white">chúng tôi</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full rounded-lg bg-white/65 border border-white/75 px-4 py-3 text-gray-500! placeholder:text-gray-400 focus:outline-none focus:border-(--bg-button)"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg bg-white/65 border border-white/75 px-4 py-3 text-gray-500! placeholder:text-gray-400 focus:outline-none focus:border-(--bg-button)"
              />

              <input
                type="text"
                placeholder="Số điện thoại"
                className="w-full rounded-lg bg-white/65 border border-white/75 px-4 py-3 text-gray-500! placeholder:text-gray-400 focus:outline-none focus:border-(--bg-button)"
              />

              <textarea
                rows={5}
                placeholder="Nội dung liên hệ"
                className="w-full rounded-lg bg-white/65 border border-white/75 px-4 py-3 text-gray-500! placeholder:text-gray-400 focus:outline-none focus:border-(--bg-button) resize-none"
              />

              <button
                className="relative overflow-hidden inline-flex items-center justify-center px-10 py-4 rounded-full border border-white text-white font-extrabold group cursor-pointer"
              >
                <span
                  className="rounded-full absolute opacity-0 w-full h-full bg-blue-500 transition duration-400 linear group-hover:opacity-100"
                />
                <span className="relative z-10 uppercase">Gửi liên hệ</span>
              </button>
            </div>

            <div className="w-full h-95 rounded-xl overflow-hidden border border-white/20">
              <iframe className="w-full h-full border-0" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3924.9504730417866!2d106.40804457481173!3d10.345845389777931!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310aae472ef969f1%3A0xf3f19f963e2485d5!2zTeG6pk0gTk9OIEjhu5JORyBQSMOaQw!5e0!3m2!1svi!2s!4v1767271953784!5m2!1svi!2s" title="map" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top */}
      <button onClick={scrollToTop} className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center bg-(--bg-button) text-white shadow-lg transition-all duration-300 cursor-pointer ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"} `}>
        <ArrowUp size={20} />
      </button>
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const intLoading = setInterval(() => setLoading(false), 1000);

    return () => clearInterval(intLoading);
  }, []);

  if (loading) return (<div className="bg-slate-50 h-screen w-screen"><Loading /></div>);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div id="home">
              <Header />
              <Main />
              <Footer />
            </div>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/page" element={<Index />}>
          <Route index element={<Dashboard />} />
          <Route path="employee" element={<Employee />} />
          <Route path="children" element={<Children />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
