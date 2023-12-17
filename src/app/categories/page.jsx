import { auth } from "../../../auth"
import { redirect } from "next/navigation"
import CategoryTable from "./categoryTable"
import Sidebar from "@/components/sidebar"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Briefkasten | Categories",
}

export default async function Categories() {
  const session = await auth()
  if (!session) {
    redirect("/auth/signin")
  }
  const { categories, tags } = await getPageData(session)

  return (
    <>
      <Sidebar />
      <main className="flex-grow basis-0">
        <div className="flex h-full flex-col items-center space-y-2">
          <CategoryTable categories={categories} userId={session?.user?.userId} />
        </div>
      </main>
    </>
  )
}

async function getPageData(session) {
  const categories = await prisma.category.findMany({
    where: {
      userId: session.user.userId,
    },
    include: {
      _count: {
        select: { bookmarks: true },
      },
    },
  })
  const tags = await prisma.tag.findMany({
    orderBy: [{ name: "asc" }],
    where: {
      userId: session.user.userId,
    },
  })

  return { tags, categories }
}
