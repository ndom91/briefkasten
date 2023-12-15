import useSWR from "swr"

export default async function useFetch({ url, method = "GET", body }) {
  const options = {
    method,
  }
  if (data) {
    options.body = JSON.stringify(body)
  }
  const fetcher = (url) => fetch(url, options).then((res) => res.json())

  const { data, error } = useSWR(url, fetcher)

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
