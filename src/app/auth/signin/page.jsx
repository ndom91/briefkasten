import { providers, signIn } from "../../../../auth"
import { ProviderIcons } from "./providerIcons"

const AuthPage = async () => {
  const enabledProviders = providers.map((p) => {
    const provider = typeof p === "function" ? p() : p
    return {
      name: provider.name,
      id: provider.id,
    }
  })
  // console.log({ enabledProviders })
  const autoLoginFirstProvider = process.env.AUTOLOGIN_FIRST_PROVIDER

  // const [email, setEmail] = useState("")
  // const { query } = useRouter()
  // const containsOauthProviders = enabledProviders.some((p) =>
  //   ["google", "github", "keycloak", "authentik"].includes(p.id),
  // )

  // if (autoLoginFirstProvider && !query.error) {
  if (autoLoginFirstProvider) {
    signIn(providers[0].id)
  }

  return (
    <>
      <div className="absolute h-full min-h-full w-full overflow-hidden">
        <div className="absolute left-0 top-0 z-10 flex h-[250%] w-[110%] translate-x-[-55%] translate-y-[-28%] rotate-[22deg] items-center bg-slate-900 md:w-[70%] md:translate-x-[-30%] md:translate-y-[-20%] md:rotate-[11deg]" />
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
              <span className="text-4xl font-medium text-white">Briefkasten</span>
            </h2>
            <div className="m-8 flex w-full flex-col gap-2 rounded bg-white p-6 shadow-lg">
              {enabledProviders.map((p) => (
                <form
                  key={p.id}
                  action={async () => {
                    "use server"
                    await signIn(p.id, { redirectTo: "/" })
                  }}
                >
                  <button
                    className={`flex h-10 w-full items-center space-x-2 rounded ${
                      p.id === "google" && "bg-blue-700 hover:bg-blue-800 focus:ring-blue-700"
                    } ${p.id === "github" && "bg-gray-600 hover:bg-gray-800 "} ${
                      p.id === "keycloak" && "bg-gray-600 hover:bg-gray-800 "
                    } ${
                      p.id === "authentik" && "bg-orange-600 hover:bg-orange-800"
                    } justify-center px-4 text-base font-light text-white transition focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2`}
                    type="submit"
                  >
                    <ProviderIcons provider={p.id} />
                    <span className="h-[22px]">Continue with {p.name}</span>
                  </button>
                </form>
              ))}
              {/* providers && containsOauthProviders && (
                <div className={`space-y-2 ${Object.keys(providers).includes("email") && "pb-6"}`}>
                  {Object.values(providers).map((p) =>
                    p.type === "oauth" ? (
                      <div key={p.name} style={{ marginBottom: 0 }}>
                        <button
                          onClick={() => signIn(p.id, { callbackUrl: "/" })}
                          className={`flex h-10 w-full items-center space-x-2 rounded ${p.id === "google" && "bg-blue-700 hover:bg-blue-800 focus:ring-blue-700"
                            } ${p.id === "github" && "bg-gray-600 hover:bg-gray-800 "} ${p.id === "keycloak" && "bg-gray-600 hover:bg-gray-800 "
                            } ${p.id === "authentik" && "bg-orange-600 hover:bg-orange-800"
                            } justify-center px-4 text-base font-light text-white transition focus:outline-none focus:ring-2 focus:ring-slate-800 focus:ring-offset-2`}
                        >
                          <ProviderIcons provider={p.id} />
                          <span className="h-[22px]">Continue with {p.name}</span>
                        </button>
                      </div>
                    ) : null,
                  )}
                </div>
              ) */}
              {/* Object.keys(providers).includes("email") ? (
                <form
                  className={`${containsOauthProviders && "border-t border-gray-200 pt-6"}`}
                  method="post"
                  action="/api/auth/signin/email"
                >
                  <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

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
                    onClick={() => signIn("email", { callbackUrl: "/", email })}
                    className="mt-4 inline-flex w-full justify-center rounded-md border border-transparent bg-slate-800 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:cursor-pointer hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:hover:cursor-not-allowed"
                    place="Continue with Magic Link Email"
                  />
                </form>
              ) : null */}
            </div>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/login_pattern.svg"
          alt="Pattern Background"
          className="fixed right-0 top-0 z-[5] min-h-full min-w-full object-cover"
        />
      </div>
    </>
  )
}

export default AuthPage
