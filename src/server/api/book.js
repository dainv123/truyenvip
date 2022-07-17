import { AuthenticateJWT } from '../helper/authenticate-jwt'

export const BookRoute = ({ app }) => {
  app.get('/books', AuthenticateJWT, (req, res) => {
    res.send('Book added successfully');
  });
}