import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Background Image */}
      <div className="bg-[url('./assets/pizza-bg-2.jpg')] bg-cover bg-center relative min-h-screen">
        {/* Dark Overlay */}
        <div className="absolute w-full h-full bg-black/60"></div>
        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center gap-[2em] relative h-screen">
          <div className="text-[2rem] mb-[-1.8em] mt-[-3em] ml-[-23em] font-semibold text-white">
            🍕 Crust & Code
          </div>
          <h2 className="text-[#ffffff] text-[7rem] font-bold text-shadow-[0_8px_10px_rgba(255,255,255,0.5)] text-outline-hover">
            Love at First Slice
          </h2>
          <h4 className="text-[#eeeeee] z-10 italic mt-[-2.3em] text-[1.2rem] font-light">
            Freshly baked pizzas made with premium ingredients and crafted with
            love.
          </h4>
          <button
            className="cursor-pointer px-[3.5em] py-[1em] text-black font-normal text-[1.2rem] bg-[#ffae00] mt-[1.5em] shadow-[0_2px_25px_rgba(255,174,0,0.4)] rounded-[100px] hover:-translate-y-0.75 hover:shadow-none hover:bg-[#e69c00] transition-all duration-250 ease"
            onClick={() => {
              navigate("/menu");
            }}
          >
            Go to Menu
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
