import client from "../../client";

export default {
  Query: {
    // findUnique is only for @unique field.
    seeProfile: (_, { userName }) => 
    client.user.findUnique({
      where: {
        userName,
      },
      include: {
        following: true,
        followers: true,
      }
    }),
  },
};