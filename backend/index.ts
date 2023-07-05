import express, { Express, Request, Response } from 'express';


//////////////////////////////////////////////////////////////////////////
import routers from "./src/routes"

//////////////////////////////////////////////////////////////////////////



const app = express();


app.use(express.json());
app.use('/api/example', routers.exampleRouter);
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`);
});

