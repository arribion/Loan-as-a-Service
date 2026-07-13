// import React from 'react'
import whyus from "../assets/whyus.png";
import hero_default from "../assets/hero-default.png";
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

export const features = [
  {
    id: 2,
    title: "Automated Credit Decisions",
    description:
      "Configure custom credit rules, risk scoring models, affordability checks, and automated approvals.",
  },
  {
    id: 3,
    title: "Flexible Loan Products",
    description:
      "Create flat-rate, reducing-balance, and custom interest products tailored to your lending strategy.",
  },
  {
    id: 4,
    title: "Instant Loan Disbursement",
    description:
      "Connect with payment providers to disburse approved loans directly into customer wallets within seconds.",
  },
  {
    id: 5,
    title: "Intelligent Repayment Collection",
    description:
      "Automated reminders, STK Push payments, webhook processing, and payment reconciliation.",
  },
  {
    id: 6,
    title: "Double-Entry Accounting",
    description:
      "Built-in immutable ledger ensuring every financial transaction remains accurate, auditable, and compliant.",
  },
  {
    id: 8,
    title: "Powerful Reporting",
    description:
      "Export financial reports to Excel or CSV and gain actionable business insights through interactive dashboards.",
  },
];


export const testimonials = [
  {
    id: 1,
    quote:
      "We reduced loan processing time from days to minutes. The platform transformed our lending operations and significantly improved customer satisfaction.",
    name: "James Mwangi",
    position: "CEO",
    company: "Digital Lending Company",
  },
  {
    id: 2,
    quote:
      "The automation alone saved our operations team hundreds of hours every month. Our staff now focus on growth instead of repetitive manual tasks.",
    name: "Sarah Wanjiku",
    position: "Operations Manager",
    company: "FinTech Solutions",
  },
  {
    id: 3,
    quote:
      "Reliable, secure, and built for scale. From loan origination to repayments, everything works seamlessly even under heavy workloads.",
    name: "David Otieno",
    position: "Head of Technology",
    company: "Enterprise Credit Group",
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
            hundreds or millions of loans, our platform scales with your
            business while maintaining enterprise-level security and
            performance.{" "}
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
        <img
          src={whyus}
          alt=""
          className="max-w-[35em] absolute bottom-[-22em] right-[-15em]"
        />
      </section>

      <section className="min-h-screen mt-[70vh] mx-4">
        <div>
          <h1 className="text-[clamp(2em,6vw,3em)] font-bold text-2xl text-green-600">
            Everything You Need
          </h1>
          <h3 className="my-4">Complete Lending Infrastructure</h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-xl border border-gray-200 p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <img src={hero_default} alt="" className="max-w-[40em]" />
      </section>

      <section className="mx-4 my-12">
        <h1 className="text-[clamp(2em,6vw,3em)] text-green-900 text-end font-bold">Testimonials</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition">
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>

              <div>
                <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
                <p className="text-green-600 font-medium">
                  {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-linear-to-br from-green-700 via-green-600 to-emerald-500 py-24">
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-green-100 backdrop-blur">
            Self-Hosted Enterprise Solution
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ready to Deploy Your Private Lending Platform?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
            Take full control of your lending infrastructure with a self-hosted
            Loan-as-a-Service platform. Deploy on your own servers or private
            cloud, customize every workflow, and maintain complete ownership of
            your data while benefiting from enterprise-grade security, dedicated
            support, and unlimited scalability.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-lg bg-white px-8 py-4 font-semibold text-green-700 transition hover:bg-green-50">
              Request a Deployment Consultation
            </button>

            <button className="rounded-lg border border-white/40 bg-transparent px-8 py-4 font-semibold text-white transition hover:bg-white/10">
              Talk to Our Solutions Team
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing