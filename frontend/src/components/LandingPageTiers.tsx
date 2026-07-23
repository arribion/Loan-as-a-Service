import { useEffect, useState } from 'react'
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
if (!BASE_URL) {
  console.log("error accessing base url for tiars");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const LandingPageTiers = () => {
  const [tier, setTier] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = () => {
    try {
      setLoading(true);
        api.get("/api/v1/package/tiers").then(response => setTier(response.data)).catch(error => console.error(error));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
  fetchData()
}, []);
  
  if (loading) {
    return( <div>
        Loading ...
    </div>
    )
  }

  if (error) {
    return (
      <div>
         error occured
      </div>
    )
  }

return (
  <>
    <section className="mx-4 my-12 min-h-screen">
      <h1 className="text-center text-[clamp(2em,5vw,3em)] font-bold text-green-600">
        Choose your perfect plan
      </h1>
      <p></p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-[4em]">
        {tier.map((t, i) => (
          <div key={i} className='shadow-lg p-2 rounded min-h-[5em]'>
            <h1 className='text-center font-bold text-green-500'> {t.name}</h1>
            <p>{t.price}</p>
            <ul>
              <li>{ t.feature }</li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  </>
);
};

export default LandingPageTiers