import cors from 'cors'
import path from 'path';
import express from 'express'
import bodyParser from 'body-parser'
import { BookRoute } from './api/book'
import { AuthenRoute } from './api/authen'
import { DB_CONFIG, KEYS } from './constants'

const app = express()

const port = process.env.PORT || DB_CONFIG.PORT;
const accessTokenSecret = KEYS.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = KEYS.REFRESH_TOKEN_SECRET;

app.listen(
  port, 
  console.log(`SERVER LISTENING ON PORT: ${port}`)
)

app.use(
  cors(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json()
)

AuthenRoute({
  app, 
  accessTokenSecret,
  refreshTokenSecret
});

if (process.env.NODE_ENV == `production`) {
  app.use(express.static(path.resolve(__dirname,'../../dist')));
  app.get('/*', (req,res)=>{
      res.sendFile(path.resolve('index.html'));
  });
}

BookRoute({ 
  app 
})
