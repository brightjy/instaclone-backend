import bcrypt from "bcrypt";
import client from "../../client";

export default {
  Mutation: {
    createAccount: async (
      _, 
      { firstName, lastName, userName, email, password}
    ) => {
      try {
        // check if username or email are already on DB.
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        if(existingUser) {
          throw new Error("This username / password is already taken.");
        }
        // hash password
        const uglyPassword = await bcrypt.hash(password, 10);
        // save and return the user
        return client.user.create({
          data: {
            userName, email, firstName, lastName, password:uglyPassword
          },
        });
      } catch (e) {
        return e;
      }
    },
  }
}