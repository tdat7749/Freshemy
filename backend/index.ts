import express, { Express, Request, Response } from 'express';


//////////////////////////////////////////////////////////////////////////
import routers from './src/routes/routes';

//////////////////////////////////////////////////////////////////////////



const app = express();


app.use(express.json());
app.use("/api/authors", routers.authorRouter);
app.use("/api/books", routers.bookRouter);
app.use("/api/authorBook", routers.authorBookRouter);
app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
});
