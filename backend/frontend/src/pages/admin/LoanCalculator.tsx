// import React from 'react'

const LoanCalculator = () => {
  return (
    <section className="bg-slate-50 rounded shadow p-2">
      <h1 className="text-center font-semibold text-2xl">Loan calculator</h1>

      <form action="" className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="">Principal: <span className="text-red-500">*</span></label>
            <br />
            <input
              type="text"
              placeholder="Loan amount..."
              className="border-2 border-slate-300 rounded p-2 w-full my-2"
            />
          </div>
          <div>
            <label htmlFor="">Interest Rate:</label>
            <br />
            <input
              type="text"
              placeholder="interest rate.."
              className="border-2 border-slate-300 rounded p-2 w-full my-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div>
              <label htmlFor="">Loan term</label>
              <br />
              <input
                type="text"
                placeholder="Loan amount..."
                className="border-2 border-slate-300 rounded p-2 w-full my-2"
              />
            </div>
            <div>
              <label htmlFor="">Payment frequency</label>
              <br />
              <input
                type="text"
                placeholder="Loan amount..."
                className="border-2 border-slate-300 rounded p-2 w-full my-2"
              />
            </div>
            <div>
              <label htmlFor="">Down Payment</label>
              <br />
              <input
                type="text"
                placeholder="Loan amount..."
                className="border-2 border-slate-300 rounded p-2 w-full my-2"
              />
            </div>
          </div>
          <div className="shadow rounded my-3 bg-slate-200"></div>
        </div>

        <button className="bg-green-800 p-2 rounded w-full my-3 text-white hover:bg-green-700">Calculator Loan</button>
      </form>
    </section>
  );
}

export default LoanCalculator