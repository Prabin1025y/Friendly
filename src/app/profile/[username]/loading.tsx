import { Loader } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full h-full grid place-items-center'>
        <Loader className='animate-spin'/>
    </div>
  )
}

export default loading