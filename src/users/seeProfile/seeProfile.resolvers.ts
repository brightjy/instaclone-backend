import { Resolvers } from "../../types";
import { protectResolver } from "../users.utils";

const resolvers:Resolvers = {
  Query: {
    // findUnique is only for @unique field.
    seeProfile: protectResolver((_, { userName }, {client}) => 
    client.user.findUnique({
      where: {
        userName,
      },
      include: {
        following: true,
        followers: true,
      }
    }),)
  },
};

export default resolvers;