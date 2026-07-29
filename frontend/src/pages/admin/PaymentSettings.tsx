import React, { useState } from 'react'
import { inputCls } from '../../utils/inputCls';
const PaymentSettings: React.FC = () => {
    const [hostpayBaseUrl, setHostpayBaseUrl] = useState("");
    const [hostpayKey, setHostpayKey] = useState("");
return (
    <section>
      <div>
        <h1 className="font-semibold text-2xl">Payment Settings</h1>
      </div>

      <section>
        <article className="bg-green-100 my-4 border-2 border-green-800 rounded-2xl p-4">
          <h1 className="font-bold text-green-700">
            HOSTPAY PAYMENT INTERGRATION
          </h1>
          <p>
            Integrating hostPay STK Push for seemless payment processing,
            Paybill C2B verification, and Wallet B2C APIs. Building powerful
            payment solutions with secure and reliable APIs.
          </p>
        </article>

        <h1>Authorization</h1>
        <form action="" className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <label htmlFor="">Host pay base url</label>
            <br />
            <input
              type="text"
              placeholder="https://api.hostpay.africa/api/..."
              value={hostpayBaseUrl}
              onChange={(e) => setHostpayBaseUrl(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="">Host pay Key</label>
            <br />
            <input
              type="text"
              value={hostpayKey}
              onChange={(e) => setHostpayKey(e.target.value)}
              placeholder="......."
              className={inputCls}
            />
          </div>
        </form>
      </section>
    </section>
  );
}

export default PaymentSettings