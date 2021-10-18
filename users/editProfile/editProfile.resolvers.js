import bcrypt from "bcrypt";
import client from "../../client";
import { protectResolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";

const resolverFn = async (
  _, 
  { firstName, lastName, userName, email, password: newPassword, bio },
  { loggedInUser, protectResolver }
) => {     
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update(
    {
      where:{
        id: loggedInUser.id,
      }, 
      data:{
        firstName, 
        lastName, 
        userName, 
        email, 
        ...(uglyPassword && { password:uglyPassword }),
      },
    },
  );
  if (updatedUser.id) {
    return {
      ok: true
    }
  } else {
    return {
      ok: false,
      error: "Could not update profile.",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectResolver(resolverFn),
  },
  Upload: GraphQLUpload,
};
