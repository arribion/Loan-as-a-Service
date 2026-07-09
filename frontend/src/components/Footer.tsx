// import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-white">
              Enterprise Loan-as-a-Service
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-slate-400">
              Empowering financial institutions with a secure, scalable, and
              intelligent lending platform designed to automate the entire loan
              lifecycle—from customer onboarding and credit assessment to loan
              disbursement, repayments, and portfolio analytics.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                "Secure",
                "Scalable",
                "Automated",
                "Built for Modern Lending",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Platform</h3>

            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="#">Features</a>
              </li>
              <li>
                <a href="#">Pricing</a>
              </li>
              <li>
                <a href="#">Integrations</a>
              </li>
              <li>
                <a href="#">Security</a>
              </li>
              <li>
                <a href="#">Documentation</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>

            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Terms of Service</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center">
          <p className="text-lg font-medium text-white">
            Enterprise Loan-as-a-Service Platform
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Secure • Scalable • Automated • Built for Modern Lending
          </p>

          <p className="mt-6 text-sm text-slate-600">
            © {new Date().getFullYear()} Arribion Technologies. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer