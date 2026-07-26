import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="p-4">
      <Link to="/">back home</Link>
      <div className="pt-[7em]">
        <h1 className="text-[clamp(2em,9vw,8em)] text-center  font-bold text-green-500">
          404
        </h1>
        <p className="text-center text-[clamp(1em,5vw,2em)]">PAGE NOT FOUND </p>
      </div>
    </section>
  );
}

export default NotFound
