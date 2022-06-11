import Meta from '@/components/meta'
import { signIn, getProviders } from 'next-auth/react'

const ProviderIcons = ({ provider }) => {
  if (provider === 'github') {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.25112 11.825 3.25112 11.825C2.92132 10.9874 2.44599 10.7644 2.44599 10.7644C1.78773 10.3149 2.49584 10.3238 2.49584 10.3238C3.22353 10.375 3.60629 11.0711 3.60629 11.0711C4.25298 12.1788 5.30335 11.8588 5.71638 11.6732C5.78225 11.205 5.96962 10.8854 6.17658 10.7043C4.56675 10.5209 2.87415 9.89918 2.87415 7.12104C2.87415 6.32925 3.15677 5.68257 3.62053 5.17563C3.54576 4.99226 3.29697 4.25521 3.69174 3.25691C3.69174 3.25691 4.30015 3.06196 5.68522 3.99973C6.26337 3.83906 6.8838 3.75895 7.50022 3.75583C8.1162 3.75895 8.73619 3.83906 9.31523 3.99973C10.6994 3.06196 11.3069 3.25691 11.3069 3.25691C11.7026 4.25521 11.4538 4.99226 11.3795 5.17563C11.8441 5.68257 12.1245 6.32925 12.1245 7.12104C12.1245 9.9063 10.4292 10.5192 8.81452 10.6985C9.07444 10.9224 9.30633 11.3648 9.30633 12.0413C9.30633 13.0102 9.29742 13.7922 9.29742 14.0299C9.29742 14.2239 9.42828 14.4496 9.79591 14.3788C12.6746 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
        ></path>
      </svg>
    )
  } else if (provider === 'google') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="m19.76 10.77l-.09-.35h-7.44v3.16h4.45a4.45 4.45 0 0 1-4.36 3.34a5.21 5.21 0 0 1-3.5-1.39A5 5 0 0 1 7.33 12a5.14 5.14 0 0 1 1.46-3.53a5 5 0 0 1 3.48-1.37a4.55 4.55 0 0 1 3 1.16L17.47 6a7.88 7.88 0 0 0-5.27-2a8.14 8.14 0 0 0-5.77 2.35a8.15 8.15 0 0 0-.09 11.21a8.37 8.37 0 0 0 6 2.44a7.45 7.45 0 0 0 5.41-2.27a8 8 0 0 0 2.08-5.54a9.88 9.88 0 0 0-.07-1.42Z"
        ></path>
      </svg>
    )
  }
}

const Signin = ({ providers }) => {
  return (
    <>
      <Meta />
      <div className="min-h-full absolute overflow-hidden w-full h-full">
        <div className="absolute top-0 left-0 z-10 flex h-[250%] w-[70%] translate-x-[-30%] translate-y-[-20%] rotate-[11deg] items-center bg-slate-900" />
        <div className="relative z-10 flex h-[calc(100vh_-_64px)] w-full items-center p-8 text-center font-bold">
          <div className="z-20 ml-[15%] flex w-[22rem] flex-col items-center justify-center text-xl">
            <h2 className="mb-4 flex items-center space-x-2 text-3xl font-light text-slate-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-slate-800 p-2 text-white"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="text-white font-medium text-2xl lg:text-4xl">
                Briefkasten
              </span>
            </h2>
            <div className="w-full m-8 rounded bg-white p-6">
              <h1 className="text-4xl font-light text-center text-gray-900 mb-6">
                Login
              </h1>

              <div className="pb-6 space-y-2 border-b border-gray-200">
                {providers &&
                  Object.values(providers).map((provider) => (
                    <div key={provider.name} style={{ marginBottom: 0 }}>
                      <button
                        onClick={() =>
                          signIn(provider.id, { callbackUrl: '/' })
                        }
                        className={`flex h-10 w-full items-center space-x-2 rounded ${
                          provider.id === 'google' &&
                          'bg-blue-700 hover:bg-blue-800 '
                        } ${
                          provider.id === 'github' &&
                          'bg-gray-600 hover:bg-gray-800 '
                        } px-4 text-base font-light text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 justify-center`}
                      >
                        <ProviderIcons provider={provider.id} />
                        <span>Continue with {provider.name}</span>
                      </button>
                    </div>
                  ))}
              </div>
              <form className="space-y-4 pt-4">
                <label className="block">
                  <span className="block mb-1 text-xs font-medium text-gray-700 text-left">
                    Your Email
                  </span>
                  <input
                    className="focus:ring-slate-500 focus:border-slate-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 placeholder:text-slate-400 placeholder:font-light font-normal transition"
                    type="email"
                    autoComplete="username"
                    disabled={true}
                    placeholder="james@bond.com"
                    inputMode="email"
                    required
                  />
                </label>
                <label className="block">
                  <span className="text-left block mb-1 text-xs font-medium text-gray-700">
                    Your Password
                  </span>
                  <input
                    className="focus:ring-slate-500 focus:border-slate-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 placeholder:text-slate-400 placeholder:font-light font-normal transition"
                    type="password"
                    disabled={true}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </label>
                <input
                  type="submit"
                  disabled={true}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:cursor-pointer transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 w-full disabled:hover:cursor-not-allowed"
                  value="Continue with email"
                />
              </form>
              <div className="my-2 text-center">
                <a
                  href="#"
                  disabled={true}
                  className="text-sm text-slate-700 underline transition font-light hover:text-slate-700"
                >
                  Forgot password
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/login_pattern.svg"
          alt="Pattern Background"
          className="fixed top-0 right-0 z-[5] min-h-full min-w-full object-cover"
        />
      </div>
    </>
  )
}

export default Signin

export async function getServerSideProps(context) {
  const providers = await getProviders()
  return {
    props: {
      providers,
    },
  }
}
