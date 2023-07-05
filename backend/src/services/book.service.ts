import { DateTime } from "luxon";
import configs from "../configs/configs";

const listBooks = async (): Promise<object> => {
    const booksRaw = await configs.db.book.findMany({
        select: {
            id: true,
            createAt: true,
            title: true,
            authorId: true,
            dataPublished: true,
            authorBook: {
                select: {
                    author: {
                        select: {
                            firstName: true,
                            lastName:true,
                        },
                    },
                },
            },
        },
    });
    return booksRaw;
};

const createBooks = async (title: string, dataPublished: string, isFiction: boolean, authorId: number): Promise<object> => {
    const rawBook = await configs.db.book.create({
        data: {
            title: title,
            dataPublished: new Date(dataPublished),
            createAt: (DateTime.now()).toJSDate(),
            updareAt: (DateTime.now()).toJSDate(),
            isFiction: isFiction,
            authorId: authorId,
    },},
    );

    return rawBook;
};

const bookService = {
    listBooks: listBooks,
    createBooks: createBooks
}

export default bookService;