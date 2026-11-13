import '@/app/globals.css'

export default function RootNotFound() {
  return (
    <html lang="en">
      <body id="view">
        <div className="flex flex-col gap-2 items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-4xl font-bold">Page Not Found</h1>
          <p className="text-lg">The page you are looking for does not exist.</p>
          <a href="/" className="text-blue-500 underline">Go to Home</a>
        </div>
      </body>
    </html>
  )
}
