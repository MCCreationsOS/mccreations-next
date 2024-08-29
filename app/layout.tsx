import './[locale]/styles/globals.css'

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
      <html>
      <head>
        <meta property="og:image:width" content="2500"></meta>
        <meta property="og:image:height" content="1408"></meta>
        <meta property="og:url" content="https://www.mccreations.net"></meta>
      </head>
      <body id="view">
          {children}
      </body>
      </html>
    )
}