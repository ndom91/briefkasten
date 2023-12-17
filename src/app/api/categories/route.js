import prisma from "@/lib/prisma"
import { auth } from "../../../../auth"

const verifyAuth = async () => {
  const session = await auth()
  console.log("AUTH.SESSION", session)
  if (!session?.user?.userId) {
    return Response(401)
  }
}

export async function GET() {
  await verifyAuth()

  return Response("Hello World!", {
    status: 200,
  })
}

// export async function POST(request) {
export const POST = auth(async (request) => {
  console.log("CATEGORIES.REQ.AUTH", request.auth)

  const {
    userId,
    data: { name, description },
  } = await request.json()

  if (!name) {
    return Response(
      { message: "Missing required field!" },
      {
        status: 400,
      },
    )
  }

  const createResult = await prisma.category.create({
    data: {
      name,
      description,
      userId,
    },
  })

  return Response.json({ data: createResult })
})

export async function PUT(request) {
  await verifyAuth()
  const { userId, name, id, description } = await request.json()

  if (!name || !id || !userId) {
    return Response(
      { message: "Missing required field(s)" },
      {
        status: 400,
      },
    )
  }

  const updateResult = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      description,
    },
  })

  return Response.json({ data: updateResult })
}
export async function DELETE(request) {
  await verifyAuth()
  const { id, userId } = await request.json()

  if (!id || !userId) {
    return Response(
      { message: "Missing required field(s)" },
      {
        status: 400,
      },
    )
  }

  try {
    await prisma.category.delete({
      where: { id },
    })
  } catch (error) {
    return Response({ message: error }, { status: 500 })
  }
  return Response.json({ message: "Deleted" })
}
