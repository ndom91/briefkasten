import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = ({ url }) => {
  const redirectTo = url.searchParams.get("redirectTo")
  return {
    redirectTo,
  }
}
