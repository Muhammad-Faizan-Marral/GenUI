'use client'
import React from "react";
import { getMasterJsonLatesOnce } from "../services/fetchService";
import { designService } from "../services/designService";

const page = () => {
 async function handleSubmit() {
    console.log("start ....")
    try { 
   const data = await getMasterJsonLatesOnce()
   console.log(data[0].project_id,data[0].master_json)
   const result = designService(data[0].project_id,data[0].master_json)

    } catch (error) {
      console.error("Error:", error);
    }

    console.log("End ....")

  }
  return <div className="h-screen bg-black text-white w-screen text-center">

    <button onClick={handleSubmit}  type="button" className="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary-soft shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none cursor-pointer hover:bg-green-800 ">Tertiary</button>

  </div>;
};

export default page;
