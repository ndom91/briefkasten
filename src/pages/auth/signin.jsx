import { useState } from 'react'
import { useRouter } from 'next/router'
import { signIn, getProviders, getCsrfToken } from 'next-auth/react'

import Meta from '@/components/meta'

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
  } else if (provider === 'keycloak') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        viewBox="0 0 52 52"
      >
        <path
          fill="currentColor"
          d="M36 16h-2v-4c0-5.52-4.48-10-10-10s-10 4.48-10 10v4h-2c-2.21 0-4 1.79-4 4v20c0 2.21 1.79 4 4 4h24c2.21 0 4-1.79 4-4v-20c0-2.21-1.79-4-4-4zm-12 18c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.2-18h-12.4v-4c0-3.42 2.78-6.2 6.2-6.2 3.42 0 6.2 2.78 6.2 6.2v4z"
        ></path>
      </svg>
    )
  } else if (provider === 'authentik') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 35 35"
        width="35"
        height="35"
      >
        <path
          class="cls-1"
          x="546.66"
          y="275.34"
          width="34.99"
          height="99.97"
          d="M18.368 9.252H19.544V12.611H18.368V9.252z"
        />
        <path
          class="cls-1"
          x="637.66"
          y="271.13"
          width="34.99"
          height="78.19"
          d="M21.425 9.111H22.601V11.737H21.425V9.111z"
        />
        <path
          class="cls-1"
          d="M4.289 12.947a4.286 4.286 0 0 0 -3.768 2.249H2.515c0.882 -0.761 2.165 -0.984 3.091 0h2.111C6.892 14.08 5.658 12.947 4.289 12.947Z"
        />
        <path
          class="cls-1"
          d="M7.137 17.222C4.387 22.97 -0.432 18.071 2.515 15.194H0.521C-1.041 17.92 1.118 21.595 4.289 21.513c2.454 0 4.475 -3.638 4.475 -4.282 0 -0.285 -0.396 -1.153 -1.048 -2.035h-2.111C6.305 15.829 6.916 16.751 7.137 17.222Zm0.074 -0.168h0Z"
        />
        <path
          class="cls-1"
          d="M33.598 9.21V24.39c0 2.909 -2.366 5.278 -5.276 5.278H26.08V24.498H15.384V29.669H13.144c-2.91 0 -5.278 -2.368 -5.278 -5.278V19.616H24.825V10.488H16.641V15.615H7.868V9.21a5.084 5.084 0 0 1 0.035 -0.605 5.189 5.189 0 0 1 0.131 -0.711c0.019 -0.075 0.042 -0.15 0.063 -0.222a0.459 0.459 0 0 1 0.018 -0.054c0.012 -0.037 0.025 -0.074 0.035 -0.108s0.026 -0.074 0.04 -0.108c0.016 -0.042 0.03 -0.081 0.045 -0.121s0.033 -0.079 0.049 -0.119a5.343 5.343 0 0 1 0.48 -0.891c0.002 -0.002 0.004 -0.005 0.005 -0.007 0.047 -0.07 0.096 -0.138 0.149 -0.206 0.044 -0.058 0.088 -0.112 0.131 -0.168 0.051 -0.061 0.105 -0.124 0.158 -0.184s0.105 -0.117 0.159 -0.172l0.005 -0.005a1.227 1.227 0 0 1 0.089 -0.089 5.367 5.367 0 0 1 0.628 -0.525c0.06 -0.044 0.123 -0.084 0.185 -0.126 0.072 -0.045 0.142 -0.089 0.215 -0.131 0.138 -0.081 0.278 -0.156 0.425 -0.222 0.045 -0.021 0.093 -0.044 0.138 -0.063a5.135 5.135 0 0 1 0.618 -0.222c0.081 -0.025 0.163 -0.045 0.245 -0.065 0.038 -0.011 0.079 -0.019 0.121 -0.028a5.325 5.325 0 0 1 0.714 -0.105l0.105 -0.005c0.018 0 0.033 -0.002 0.051 -0.002 0.079 -0.004 0.159 -0.005 0.242 -0.005H28.32c0.081 0 0.161 0.002 0.24 0.005 0.018 0 0.033 0.002 0.051 0.002l0.105 0.005A5.318 5.318 0 0 1 29.433 4.051c0.042 0.007 0.081 0.018 0.121 0.028 0.082 0.019 0.163 0.042 0.245 0.065A5.135 5.135 0 0 1 30.415 4.368c0.045 0.019 0.093 0.042 0.138 0.063 0.145 0.067 0.287 0.142 0.425 0.222 0.074 0.044 0.144 0.088 0.215 0.131 0.063 0.042 0.126 0.082 0.185 0.126a5.294 5.294 0 0 1 0.723 0.619c0.056 0.054 0.108 0.112 0.159 0.172s0.107 0.123 0.158 0.184c0.044 0.054 0.088 0.11 0.13 0.168 0.051 0.07 0.102 0.138 0.149 0.206 0.002 0.002 0.004 0.005 0.005 0.007a5.365 5.365 0 0 1 0.48 0.891c0.016 0.04 0.033 0.079 0.049 0.119s0.03 0.079 0.045 0.121c0.014 0.035 0.028 0.072 0.038 0.108s0.025 0.072 0.035 0.108a0.528 0.528 0 0 1 0.018 0.054c0.021 0.074 0.044 0.149 0.063 0.222a5.24 5.24 0 0 1 0.13 0.711A5.084 5.084 0 0 1 33.598 9.21Z"
        />
      </svg>
    )
  }
}

const Signin = ({ providers, csrfToken, autoLoginFirstProvider }) => {
  const [email, setEmail] = useState('')
  const { query } = useRouter()
  const containsOauthProviders = Object.keys(providers).some((p) =>
    ['google', 'github', 'keycloak', 'authentik'].includes(p)
  )

  if (autoLoginFirstProvider && !query.error) {
    signIn(providers[0])
  }

  return (
    <>
      <Meta />
      <div className="absolute h-full min-h-full w-full overflow-hidden">
        <div className="absolute top-0 left-0 z-10 flex h-[250%] w-[110%] translate-x-[-55%] translate-y-[-28%] rotate-[22deg] items-center bg-slate-900 md:w-[70%] md:translate-y-[-20%] md:translate-x-[-30%] md:rotate-[11deg]" />
        <div className="relative z-10 flex h-[calc(100vh_-_64px)] w-full items-center justify-center p-8 text-center font-bold md:justify-start">
          <div className="z-20 flex w-[22rem] flex-col items-center justify-center text-xl md:ml-[15%]">
            <h2 className="mb-4 flex items-center space-x-2 text-3xl font-light text-slate-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-10 w-10 rounded-full bg-slate-800 p-2 text-white lg:h-12 lg:w-12"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
              <span className="text-4xl font-medium text-white">
                Briefkasten
              </span>
            </h2>
            <div className="m-8 w-full rounded bg-white p-6 shadow-lg">
              {providers && containsOauthProviders && (
                <div
                  className={`space-y-2 ${
                    Object.keys(providers).includes('email') && 'pb-6'
                  }`}
                >
                  {Object.values(providers).map((p) =>
                    p.type === 'oauth' ? (
                      <div key={p.name} style={{ marginBottom: 0 }}>
                        <button
                          onClick={() => signIn(p.id, { callbackUrl: '/' })}
                          className={`flex h-10 w-full items-center space-x-2 rounded ${
                            p.id === 'google' &&
                            'bg-blue-700 hover:bg-blue-800 focus:ring-blue-700'
                          } ${
                            p.id === 'github' &&
                            'bg-gray-600 hover:bg-gray-800 '
                          } ${
                            p.id === 'keycloak' &&
                            'bg-gray-600 hover:bg-gray-800 '
                          } ${
                            p.id === 'authentik' &&
                            'bg-orange-600 hover:bg-orange-800'
                          } justify-center px-4 text-base font-light text-white transition focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2`}
                        >
                          <ProviderIcons provider={p.id} />
                          <span className="h-[22px]">
                            Continue with {p.name}
                          </span>
                        </button>
                      </div>
                    ) : null
                  )}
                </div>
              )}
              {Object.keys(providers).includes('email') ? (
                <form
                  className={`${
                    containsOauthProviders && 'border-t border-gray-200 pt-6'
                  }`}
                  method="post"
                  action="/api/auth/signin/email"
                >
                  <input
                    name="csrfToken"
                    type="hidden"
                    defaultValue={csrfToken}
                  />

                  <label className="block">
                    <span className="mb-1 block text-left text-xs font-medium text-gray-700">
                      Email Magic Link
                    </span>
                    <input
                      className="block w-full flex-1 rounded-md border-gray-300 font-normal transition placeholder:font-light placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
                      type="email"
                      autoComplete="username"
                      disabled={false}
                      placeholder="user@company.com"
                      inputMode="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <input
                    type="submit"
                    disabled={false}
                    onClick={() => signIn('email', { callbackUrl: '/', email })}
                    className="mt-4 inline-flex w-full justify-center rounded-md border border-transparent bg-slate-800 py-2 px-4 text-sm font-medium text-white shadow-sm transition hover:cursor-pointer hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:hover:cursor-not-allowed"
                    place="Continue with Magic Link Email"
                  />
                </form>
              ) : null}
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
  const csrfToken = await getCsrfToken(context)
  const autoLoginFirstProvider = process.env.AUTOLOGIN_FIRST_PROVIDER

  return {
    props: {
      providers,
      csrfToken,
      autoLoginFirstProvider,
    },
  }
}
