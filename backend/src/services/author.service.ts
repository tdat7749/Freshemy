import { DateTime } from "luxon";
import configs from "../configs/configs";

const listAuthors = async (): Promise<object> => {
  const authorsRaw = await configs.db.author.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      authorBook: {
        select: {
          book: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });
  return authorsRaw;
};

const createAuthors = async (
  lastName: string,
  firstName: string
): Promise<object> => {
  const rawAuthor = await configs.db.author.create({
    data: {
      lastName: lastName,
      firstName: firstName,
      createAt: DateTime.now().toJSDate(),
      updareAt: DateTime.now().toJSDate(),
    },
  });
  return rawAuthor;
};

const authorService = {
  listAuthors: listAuthors,
  createAuthors: createAuthors,
};

export default authorService;
