import React from "react";
import Results from "./Result";
import Directory from "./Directory";
import Navbars from "../Components/Navbars";
import Chat from "../realchatpage";

const Homes = () => {
  return (
    <>
      <div className=" flex flex-row xl:w-full max-h-full">
        <div className=" flex-col">
          <Navbars/>
        </div>
        <div className=" flex flex-col">
          <Results/>
        </div>
        <div className=" flex flex-col bg-red-700">
          <Chat/>
        </div>
        <div>
          <Directory/>
        </div>
      </div>
    </>
  );
};

export default Homes;
