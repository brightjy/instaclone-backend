require('dotenv').config();
import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import express from "express";
import logger from "morgan";
import { typeDefs, resolvers } from "./schema";
import { getUser, protectResolver } from "./users/users.utils";
import client from "./client";

const PORT = process.env.PORT;
const apollo = async() => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: async({ req }) =>{
      return {
        loggedInUser: await getUser(req.headers.authorization),
        //client: client,
        client,
        protectResolver,
      };
    },
  });
  await server.start();
  const app = express();
  app.use(graphqlUploadExpress());
  app.use(logger("tiny"));
  app.use("/static", express.static("uploads")); // 폴더를 웹서버에 올림
  server.applyMiddleware({ app });
  //await new Promise((func) => app.listen({port:PORT}, func));
  await new Promise(() => app.listen({port:PORT}));
  //console.log(`🍀 Server is running on http://localhost:${PORT}/graphql`);
}
apollo();

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