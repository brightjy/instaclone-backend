require('dotenv').config();
import { ApolloServer } from "apollo-server";
import schema from "./schema";
import { getUser } from "./users/users.utils";

const PORT = process.env.PORT;
const server = new ApolloServer({
  schema, 
  context: async({ req }) =>{
    return {
      loggedInUser: await getUser(req.headers.authorization),
    };
  },
  // context: ({ req }) => {
  //   return {
  //     authorization: req.headers.authorization,
  //   };
  // },
  // context: {
  //   // context 에 담은 것은 모든 resolver에서 꺼내 쓸 수 있다.
  //   Authorization:
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMyMzEzNDkxfQ.jG2z46p2FYIqIlCgiBxAqPBt3eb1wXR4qYrvtps5fyQ",
  // }
});

server
  .listen(PORT)
  .then(() => console.log(`🍀 Server is running on http://localhost:${PORT}/`));