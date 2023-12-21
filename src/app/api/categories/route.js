import prisma from "@/lib/prisma"
import { auth } from "../../../../auth"

export async function GET() {
  return Response("Hello World!", {
    status: 200,
  })
}

// export async function POST(request) {
export const POST = auth(async (request) => {
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

export const PUT = auth(async (request) => {
  const { userId, name, id, description } = await request.json()
  console.log("PUT DATA", { userId, name, id, description })

  if (!name || !id || !userId) {
    return new Response(
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
})

export const DELETE = auth(async (request) => {
  const { userId, id } = await request.json()

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
})
