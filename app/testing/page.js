'use client'
import React from 'react'
import { getComponentTabelId, getItemsTabelId, getProfilId, getProjectId, getUserId } from '../services/uiService'

const Page = () => { 

  async function handleSubmit() {
    console.log("strt")
    try { 
      const user_id = await getUserId()
      const result = await getProfilId(user_id); 
      const pid = await getProjectId(result)
      const cid = await getComponentTabelId(pid)
      const Iid = await getItemsTabelId(cid)
      

      

      console.log("Result id"+result)
      console.log("pid id"+pid)
      console.log("cid id"+cid)
      console.log("Iid id"+Iid)



    } catch (error) {
      console.error("Error:", error);
    }
  }
   
  return (
    <div onClick={handleSubmit} className='text-4xl cursor-pointer h-screen bg-black'>
      page
    </div>
  )
}

export default Page