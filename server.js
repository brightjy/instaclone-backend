require('dotenv').config();
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";

const PORT = process.env.PORT;
const startServer = async() => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: async({ req }) =>{
      return {
        loggedInUser: await getUser(req.headers.authorization),
        protectResolver,
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
  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  server.applyMiddleware({ app });
  await new Promise((func) => app.listen({port:PORT}, func));
  console.log(`🍀 Server is running on http://localhost:${PORT}${server.graphqlPath}`);
}
startServer();


// server
//   .listen(PORT)
//   .then(() => console.log(`🍀 Server is running on http://localhost:${PORT}/`));

const x = (resolver) => (root, args, context, info) => {
  if (!context.loggedInUser) {
    return {
      ok: false,
      error: "log in plz."
    }
  }
  return resolver(root, args, context, info);
};