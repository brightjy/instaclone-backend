import bcrypt from "bcrypt";
import client from "../client";

export default {
  Mutation: {
    createAccount: async (
      _, 
      { firstName, lastName, userName, email, password}
      ) => {
      // check if username or email are already on DB.
      const existingUser = await client.user.findFirst({
        where: {
          OR: [
            {
              userName,
            },
            {
              email,
            },
          ],
        },
      });
      console.log(existingUser);
      // hash password
      const uglyPassword = await bcrypt.hash(password, 10);
      console.log(uglyPassword);
      // save and return the user
      return client.user.create({
        data: {
          userName, email, firstName, lastName, password:uglyPassword
        },
      });
    },
  },
};