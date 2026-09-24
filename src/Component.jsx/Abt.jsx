import React from 'react';

const About = () => {
  // Services & Capabilities Offered by Sultan
  const servicesList = [
    { icon: "🖼️", title: "Custom Frames", desc: "Minimalist, gold foil, and premium wall art frame mockups and designs." },
    { icon: "💼", title: "Business Cards", desc: "Sleek, high-grade corporate identity and print-ready business cards." },
    { icon: "📜📱", title: "Flyers & Posters", desc: "High-impact promotional materials, event posters, marketing prints, Social post and viral promotional graphics." },
    { icon: "📚", title: "Typesetting of Project", desc: "Complete Typesetting of project and other typesetting at hands ( Expert in both English and Arabic typesetting)" },
    { icon: "🌁", title: "Sticker and Banner", desc: " Printing and designing Sticker and banner and so on " },
    { icon: "</>", title: "Web developer", desc: "Also experience in handling your newest website to come alive" },
    { icon: "🎨", title: "3D Abstract Artwork", desc: "Modern 3D digital art and graphics designed for digital or physical print." },
    { icon: "💻", title: "UI/UX design", desc: "Digital design assets for web interfaces, mobile apps, and software kits." }
  ];

  // Core Working Values
  const values = [
    {
      icon: "⚡",
      title: "Speed & Quality",
      description: "Delivering world-class graphic assets quickly without compromising on creative precision."
    },
    {
      icon: "🎨",
      title: "Pixel Perfection",
      description: "Every vector, frame, and font choice is crafted to ensure your brand stands out."
    },
    {
      icon: "🤝",
      title: "Client Centered",
      description: "Your vision comes first. Direct communication and transparent updates every step of the way."
    }
  ];

  return (
    <main className="min-h-screen bg-neutral-950 font-sans text-neutral-100 pb-20 overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 pt-8 mb-16 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 rounded-3xl overflow-hidden shadow-2xl lg:flex relative min-h-[450px]">
          
          {/* Subtle background grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:32px_32px]"></div>

          {/* Left Side: Content */}
          <div className="relative z-10 lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-white">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-200 mb-3 bg-black/30 w-fit px-3 py-1 rounded-full border border-amber-300/20">
              Meet The Lead Designer
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Hi, I'm <span className="text-black underline decoration-amber-300 underline-offset-4">Sultan</span>.
            </h1>
            <p className="text-amber-100 text-sm sm:text-base leading-relaxed font-light max-w-md">
              Graphic designer with over 7 years of hands-on experience building visual identities, custom frames, marketing prints, and modern digital artwork.
            </p>
          </div>

          {/* Right Side: Visual Showcase Image */}
          <div 
            className="lg:w-1/2 bg-cover bg-center min-h-[280px] lg:min-h-full relative"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=80')` 
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-amber-700/80 via-transparent to-black/20"></div>
          </div>

        </div>
      </div>

      {/* 2. MY STORY & JOURNEY */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-20">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 sm:p-12 space-y-6 text-base sm:text-lg text-neutral-300 leading-relaxed font-light shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">My Background</span>
          <h2 className="text-3xl font-black text-white tracking-tight">Designing Since 2019</h2>
          <p>
            My journey into the world of graphic design began back in <strong className="font-semibold text-amber-500">2019</strong> . What started out as a passion for experimenting with shapes, vectors, and layouts quickly grew into a lifelong dedication to design excellence.
          </p>
          <p>
            Over the years, I have honed my craft across digital and print mediums. Through <strong className="font-semibold text-white">OrderMygraphics</strong>, my goal is to deliver clean, modern visual assets—from personalized art frames to high-converting corporate print materials—making high-end graphic design accessible, quick, and reliable for everyone.
          </p>
        </div>
      </section>

      {/* 3. WHAT I CAN DO FOR YOU (SERVICES LIST) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-500">My Capabilities</span>
          <h2 className="text-3xl font-black tracking-tight text-white mt-1">
            What I Can Create For You
          </h2>
          <p className="text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
            A comprehensive overview of graphic design services and custom print items available on OrderMygraphics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesList.map((service, idx) => (
            <div 
              key={idx}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 shadow-lg"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CORE VALUES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            The Design Principles I Live By
          </h2>
          <p className="text-sm text-neutral-400 mt-2">Quality standards applied to every single project.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 shadow-sm hover:border-amber-600 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-amber-500/10 text-2xl rounded-xl flex items-center justify-center mb-6 border border-amber-500/20">
                {value.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
};

export default About;