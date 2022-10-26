import SignIn from './clientSignIn'

const SigninPage = async () => {
  const { providers, csrfToken } = await getData()

  return (
    <>
      <SignIn providers={providers} csrfToken={csrfToken} />
    </>
  )
}

async function getData() {
  // const providers = await getProviders()
  const providers = await fetch(
    'http://localhost:3001/api/auth/providers'
  ).then((r) => r.json())
  // const csrfToken = await getCsrfToken(context)
  const csrfToken = await fetch('http://localhost:3001/api/auth/csrf').then(
    (r) => r.json()
  )

  return {
    providers,
    csrfToken,
  }
}

export default SigninPage
