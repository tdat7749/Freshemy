import { DateTime } from "luxon";
import configs from "../configs";

const example = async (): Promise<object> => {
    const example = await configs.db.exampleUser.findMany({
        select: {
            id: true,
            createAt: true,
            Name: true,
        },
    });
    return example;
};

const exampleCreate = async (): Promise<any> => {
    const example = await configs.db.exampleUser.createMany({
        data: [
            { id: 1, Name: "Vuong1" },
            { id: 2, Name: "Vuong2" },
            { id: 3, Name: "Vuong2" },
        ],
    });
    return example;
};

const exampleService = {
    exampleGet: example,
    exampleCreate: exampleCreate,
};

export default exampleService;
