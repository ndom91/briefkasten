// import { getSession } from 'next-auth/react'
//
// export default async function Restricted(req, res) {
//   const session = await getSession({ req })
//   if (session) {
//     res.send({
//       content:
//         'This is protected content. You can access this content because you are signed in.',
//     })
//   } else {
//     res.send({
//       error: 'You must be sign in to view the protected content on this page.',
//     })
//   }
// }
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'

export async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).json({ message: 'You must be logged in.' })
    return
  }
  return res.json({
    message: 'Success',
  })
}
