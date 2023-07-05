import { DateTime } from "luxon";
import configs from "../configs/configs";


const linkAuthorBook = async (authorId: number, bookId: number): Promise<object | undefined> => {
    const rawBook = await configs.db.authorBook.create({
        data: {
            author: {
                connect: {
                    id: authorId
                },
            },
            book: {
                connect: {
                    id: bookId
                },
            },
        }, }
    );
    const rawAuthor = await configs.db.author.findUnique({
        where: {id: rawBook.authorId},
        include: {authorBook: true}
    })
    if(rawAuthor) {
        return rawBook;
    }
    else return undefined;
};



const authorBookService = {
    linkAuthorBook: linkAuthorBook,
}

export default authorBookService;