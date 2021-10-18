import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectResolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";

const resolverFn = async (
  _, 
  { firstName, lastName, userName, email, password: newPassword, bio, avatar },
  { loggedInUser, protectResolver }
) => {     
  const {
    filename,
    createReadStream
  } = await avatar;
  // 폴더에 파일저장
  const readStream = createReadStream();
  const writeStream = createWriteStream(process.cwd() + "/uploads/" + filename);
  readStream.pipe(writeStream);
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
