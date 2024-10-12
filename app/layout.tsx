import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import './[locale]/styles/globals.css'

export default function Layout({ children }: {children: React.ReactNode}) {
    return (
      <>
      {children}
      </>
    )
}