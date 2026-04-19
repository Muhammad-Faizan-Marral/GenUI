import React from "react";

const page = () => {
  return (
    <div>
      <section className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-[#f8fafc] pt-[64px] px-4 md:px-8 lg:px-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">Muhammad Faizan</h1>
        <h2 className="text-xl md:text-2xl font-medium text-secondary mb-4">Developer</h2>
        <p className="text-lg md:text-xl text-muted max-w-md text-center mb-6">Passionate about building scalable web applications.</p>
        <a href="#projects" className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">View Projects</a>
        
      </section>

    </div>
  );
};

export default page;
