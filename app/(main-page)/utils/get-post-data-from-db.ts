import { db } from "@/lib/db";
import type { PostCategory, PostType, SortOrder } from "@/types/globals";
import { Prisma } from "@prisma/client";

interface GetPostDataFromDbProps {
  type: PostType;
  category: PostCategory;
  currentPage?: number;
  searchParams?: string;
  postsPerPage: number;
  sort: SortOrder;
  userId?: string;
}

export default async function getPostDataFromDb({
  type,
  category,
  currentPage,
  searchParams,
  postsPerPage,
  sort,
  userId,
}: GetPostDataFromDbProps) {
  const query = {
    skip: currentPage ? (currentPage - 1) * postsPerPage : 0,
    take: postsPerPage,
    where: {
      postType: type,
      userId: userId,
      title: {
        contains: searchParams,
        mode: "insensitive",
      },
      category: {
        equals: category,
      },
    },
    orderBy: {
      createdAt: sort ? sort : "desc",
    },
  } satisfies Prisma.PostFindManyArgs;

  const [postsList, queriedPostsCount, totalPostCount] = await db.$transaction([
    db.post.findMany(query),
    db.post.count({ where: query.where }),
    db.post.count({ where: { postType: type } }),
  ]);

  return { postsList, queriedPostsCount, totalPostCount };
}
