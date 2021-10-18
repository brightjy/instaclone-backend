import bcrypt from "bcrypt";
import client from "../../client";
import { protectResolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";

const resolverFn = async (
  _, 
  { firstName, lastName, userName, email, password: newPassword, bio, avatar },
  { loggedInUser, protectResolver }
) => {     
  //console.log(avatar);
  const {
    filename,
    createReadStream
  } = await avatar;
  //console.log(filename, createReadStream)
  const stream = createReadStream();
  console.log(stream);
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
        bio,
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
