import React from 'react'
import COVER from "@/assets/Cover.png"

const CoverImage = () => {
  return (
    <div className='w-full flex flex-col items-center '>
      <img 
        src={COVER} 
        alt="Dashboard cover" 
        className='pt-6 object-cover h-screen'
       style={{width:'70%', height:'100%'}}
      />
    </div>
  )
}

export default CoverImage