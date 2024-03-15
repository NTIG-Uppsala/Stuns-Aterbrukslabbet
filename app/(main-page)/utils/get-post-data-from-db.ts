import { db } from "@/lib/db";
import { PostCategory, PostType } from "@/types/globals";
import { Prisma } from "@prisma/client";

interface GetPostDataFromDbProps {
  type: PostType;
  category: PostCategory;
  currentPage?: number;
  searchParams?: string;
  postsPerPage: number;
  sort: "asc" | "desc";
}

export default async function GetPostDataFromDb({
  type,
  category,
  currentPage,
  searchParams,
  postsPerPage,
  sort,
}: GetPostDataFromDbProps) {
  const query = {
    skip: currentPage ? (currentPage - 1) * postsPerPage : 0,
    take: postsPerPage,
    where: {
      postType: type,
      title: {
        contains: searchParams,
        mode: "insensitive",
      },
      category: {
        equals: category,
      },
    },
    orderBy: {
      createdAt: sort,
    },
  } satisfies Prisma.PostFindManyArgs;

  const [postsList, queriedPostsCount, totalPostCount] = await db.$transaction([
    db.post.findMany(query),
    db.post.count({ where: query.where }),
    db.post.count({ where: { postType: type } }),
  ]);

  return { postsList, queriedPostsCount, totalPostCount };
}
