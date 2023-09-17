import { Suspense } from 'react'
import './styles/globals.css'
import Loading from './loading'
 
export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
            {children}
        </Suspense>
    </body>
    </html>
  )
}
