import { PopularArticlesType } from "./popular-articles.type"

export type BlogType = {
    count: number,
    pages: number,
    items: PopularArticlesType[]
}