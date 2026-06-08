export type ArticleType = {
    text: string,
    comments:{
        id: string,
        text: string,
        date: string,
        likesCount: number,
        dislikesCount: number,
        user: {
            id: string,
            name: string
        }
    }[],
    commentsCount: number,
    id: "63ca02683fe296dbe1e873e2",
    title: "6 сайтов для повышения  продуктивности",
    description: "Хотите проводить время в сети с пользой? Наша подборка из шести полезных, но малоизвестных сайтов увеличит вашу продуктивность, поможет успевать больше в течение дня и всегда быть на шаг впереди!",
    image: "testimagepath",
    date: "2023-01-20T02:54:32.543Z",
    category: "Фриланс",
    url: "6_saitov_dlya_povisheniya__produktivnosti"
}