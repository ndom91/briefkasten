import { signIn, getProviders } from 'next-auth/react'

const Signin = ({ providers }) => {
  return (
    <div className="min-h-full overflow-hidden">
      <div className="fixed top-0 left-0 z-10 flex h-[150%] w-[70%] translate-x-[-20%] translate-y-[-10%] rotate-[11deg] items-center bg-slate-700" />
      <div className="relative z-10 flex h-[calc(100vh_-_64px)] w-full items-center p-8 text-center font-bold">
        <div className="z-20 ml-[15%] flex w-96 flex-col items-center justify-center text-xl">
          <div className="w-100 m-8 rounded bg-white p-8">
            <h2 className="mb-4 text-3xl font-black text-slate-600">
              Briefkasten
            </h2>
            <hr className="mb-4" />
            {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name} style={{ marginBottom: 0 }}>
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                    className="h-12 w-full rounded bg-slate-800 py-2 px-4 text-white"
                  >
                    Sign in with {provider.name}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/login_pattern.svg"
        alt="Pattern Background"
        layout="fill"
        className="fixed top-0 right-0 z-[5] min-h-full min-w-full"
      />
    </div>
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
