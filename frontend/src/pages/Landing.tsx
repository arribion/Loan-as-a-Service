// import React from 'react'
import whyus from "../assets/whyus.png";

const whyUs = [
  {
    id: 1,
    why: "Lightning Fast",
    des: "Process thousands of loan applications with automated workflows and real-time decision making.",
  },
  {
    id: 2,
    why: "Bank-Level Security",
    des: "AES-256 encryption, role-based access control, audit logs, rate limiting, and secure API architecture.",
  },
  {
    id: 3,
    why: "Multi-Tenant Architecture",
    des: "Serve multiple organizations from a single platform while keeping every tenant completely isolated.",
  },
  {
    id: 3,
    why: "Cloud Native",
    des: "Reliable infrastructure designed for 99.9% uptime with automatic scaling.",
  },
];
import hero_img from "../assets/hero.png"
const Landing = () => {
  return (
    <>
      {/* hero section */}
      <section className="min-h-[60vh] grid grid-cols-2 gap-8">
        <div className="p-4">
          <h1 className="text-[clamp(1.5em,5vw,3em)] text-green-700 font-bold pt-18">
            Enterprise Loan Management, Re-imagined.
          </h1>

          <p>
            Power the next generation of digital lending with a secure, scalable
            Loan-as-a-Service platform built for microfinance institutions,
            SACCOs, fintechs, and enterprise lenders.
          </p>

          <p className="text-[14px] mt-4">
            Automate loan origination, customer onboarding, credit scoring,
            repayments, accounting, and analytics—all from one intelligent
            platform.
          </p>

          <div className="flex gap-8 my-6">
            <button className="py-1 px-12 border rounded">
              Start Free Trial
            </button>
            <button className="py-1 px-12 border rounded">Book a Demo</button>
          </div>
        </div>

        <div className="relative flex items-end justify-center">
          {/* Green blob */}
          <div className="absolute bottom-8 w-80 h-80 bg-green-500 rounded-full blur-2xl opacity-40 -z-10"></div>

          {/* Image */}
          <img src={hero_img} alt="" className="relative max-w-[28em] z-10" />
        </div>
      </section>

      {/* trusted by */}
      <section className=" ">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] p-4 bg-gray-600 text-slate-50 font-bold">
          {[
            "SACCOs",
            "FinTech",
            "Microfinance-Inst",
            "Companies",
            "Digital Banks",
            " Credit Providers",
          ].map((item) => (
            <div>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* why choose us section */}
      <section className="min-h-screen max-w-[70vw] flex justify-end p-4 relative">
        <div>
          <h1 className="text-[clamp(1.5em,5vw,3em)]  text-center font-bold pt-18 text-green-900 my-3">
            {" "}
            Why Choose Our Platform
          </h1>
          <p>
            Built for High-Growth Lending Businesses Whether you're processing
            hundreds or millions of loans, our platform scales with your business
            while maintaining enterprise-level security and performance.{" "}
          </p>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 my-6">
            {whyUs.map((item, index) => (
              <div
                key={index}
                className="border border-slate-500/50 shadow-md rounded-[10px] p-4">
                <h3 className="font-bold my-3 text-[18px]">{item.why}</h3>
                <p>{item.des}</p>
              </div>
            ))}
          </div>
        </div>
        <img src={whyus} alt="" className="max-w-[35em] absolute bottom-[-22em] right-[-15em]" />
      </section>

      <section className="min-h-screen mx-4">
<h1></h1>
      </section>
    </>
  );
}

export default Landing