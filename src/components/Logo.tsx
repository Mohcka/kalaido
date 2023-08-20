import { cn } from '@/lib/utils'
import React from 'react'

const Logo: React.FC<React.ComponentProps<'span'>> = ({className}) => {
  return (
    <span className={cn(className)}>
      kal<span className='text-pink-500'>ai</span>do
    </span>
  );
}

export default Logo