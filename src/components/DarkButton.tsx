'use client'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

const DarkButton = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted)
    return
  else
    return (
      <Button className='cursor-pointer' variant="outline" size="icon" onClick={() => setTheme(theme == 'light' ? "dark" : "light")}>
        {theme == 'dark'
          ? <Sun />
          : <Moon />
        }
      </Button>
    )
}

export default DarkButton