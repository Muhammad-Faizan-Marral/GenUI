import React from "react";

const page = () => {
  return (
    <div>
      <div className="bg-[#030303] text-zinc-100 min-h-screen selection:bg-indigo-500/30 font-sans overflow-x-hidden">
        <nav className="fixed top-0 left-0 right-0 z-[100] h-20 backdrop-blur-xl border-b border-white/5 bg-[#030303]/80 flex items-center justify-between px-8">
          <div className="text-2xl font-bold">SaaS Pricing</div>
          <div className="flex items-center space-x-4">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
              Sign In
            </button>
            <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
              Get Started
            </button>
          </div>
        </nav>
        <section className="relative py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
          <div className="min-h-[85vh] flex flex-col justify-center items-start space-y-8">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[150px] rounded-full z-[-1]"></div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
              Pricing Plans
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
              Choose the plan that's right for you and your business. Our
              pricing is flexible and scalable to meet your needs.
            </p>
          </div>
        </section>
        <section className="relative py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full mb-12">
          <h2 className="text-4xl font-bold mb-4">Plans</h2>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 lg:col-span-4 bg-[#0a0a0a] border border-zinc-800 p-8 rounded-3xl hover:border-zinc-500 transition-all duration-500 hover:-translate-y-2 group">
              <icon name="briefcase" className="w-8 h-8 mb-4 text-indigo-500" />
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-lg text-zinc-400 mb-4">$9.99/month</p>
              <ul>
                <li>1 user</li>
                <li>100MB storage</li>
                <li>Email support</li>
              </ul>
              <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform mt-4">
                Sign Up
              </button>
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4 bg-[#0a0a0a] border border-zinc-800 p-8 rounded-3xl hover:border-zinc-500 transition-all duration-500 hover:-translate-y-2 group">
              <icon name="rocket" className="w-8 h-8 mb-4 text-indigo-500" />
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-lg text-zinc-400 mb-4">$19.99/month</p>
              <ul>
                <li>5 users</li>
                <li>1GB storage</li>
                <li>Priority support</li>
              </ul>
              <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform mt-4">
                Sign Up
              </button>
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4 bg-[#0a0a0a] border border-zinc-800 p-8 rounded-3xl hover:border-zinc-500 transition-all duration-500 hover:-translate-y-2 group">
              <icon name="diamond" className="w-8 h-8 mb-4 text-indigo-500" />
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-lg text-zinc-400 mb-4">Custom pricing</p>
              <ul>
                <li>10+ users</li>
                <li>10GB storage</li>
                <li>Dedicated support</li>
              </ul>
              <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform mt-4">
                Contact Us
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-8">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
              Monthly
            </button>
            <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
              Yearly
            </button>
          </div>
        </section>
        <section className="relative py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full mb-12">
          <h2 className="text-4xl font-bold mb-4">Features</h2>
          <ul>
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
            <li>Feature 4</li>
            <li>Feature 5</li>
          </ul>
        </section>
        <section className="relative py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full mb-12">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis
            natoque penatibus et magnis dis parturient montes, nascetur
            ridiculus mus.
          </p>
        </section>
        <section className="relative py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full mb-12">
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet nulla auctor, vestibulum magna sed, convallis ex. Cum sociis
            natoque penatibus et magnis dis parturient montes, nascetur
            ridiculus mus.
          </p>
          <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform mt-4">
            Get in Touch
          </button>
        </section>
        <footer className="relative py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full bg-[#0a0a0a] text-zinc-400">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <h3 className="text-2xl font-bold mb-2">About Us</h3>
              <p className="text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
                amet nulla auctor, vestibulum magna sed, convallis ex.
              </p>
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <h3 className="text-2xl font-bold mb-2">Features</h3>
              <ul>
                <li>Feature 1</li>
                <li>Feature 2</li>
                <li>Feature 3</li>
              </ul>
            </div>
            <div className="col-span-12 md:col-span-4 lg:col-span-4">
              <h3 className="text-2xl font-bold mb-2">Contact Us</h3>
              <p className="text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
                amet nulla auctor, vestibulum magna sed, convallis ex.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default page;
