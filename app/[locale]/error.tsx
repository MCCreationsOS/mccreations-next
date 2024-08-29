'use client' // Error components must be Client Components
 
import MenuSkeleton from '@/components/skeletons/MenuSkeleton'
import { useEffect } from 'react'
import { sendLog } from '@/app/api/logging'
import WarningButton from '@/components/Buttons/WarningButton'
 
export default function Error({ error, reset, }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error)
    sendLog("Error page", error)
  }, [error])
 
  return (
    <div>
        <MenuSkeleton />
      <h2>Something went wrong!</h2>
      <WarningButton
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </WarningButton>
    </div>
  )
}