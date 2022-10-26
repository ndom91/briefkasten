import Meta from '@/components/meta'
import AuthContext from './authContext'
import ZustandContext from './zustandContext'
import ToastContext from './toastContext'
import Sidebar from '@/components/sidebar'
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Meta />
      </head>
      <body>
        <AuthContext>
          <ZustandContext>
            <ToastContext>
              <section className="mx-auto flex h-full max-w-full items-stretch overflow-hidden selection:bg-slate-800 selection:text-white">
                <Sidebar />
                <main className="flex-grow basis-0">{children}</main>
              </section>
              <div className="pattern fixed top-0 left-0 -z-[1] h-full w-full" />
            </ToastContext>
          </ZustandContext>
        </AuthContext>
      </body>
    </html>
  )
}
