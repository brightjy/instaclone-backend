import { createWriteStream } from "fs";
import bcrypt from "bcrypt";
import client from "../../client";
import { protectResolver } from "../users.utils";
import { GraphQLUpload } from "graphql-upload";
import { uploadPhoto } from "../../common/common.utils";

const resolverFn = async (
  _, 
  { firstName, lastName, userName, email, password: newPassword, bio, avatar },
  { loggedInUser, protectResolver }
) => {     
  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await uploadPhoto(avatar, loggedInUser.id);
    /* 아래는 파일을 서버에 저장할 때 하는 방식 */
    // const { filename } = await avatar;
    // const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    // 폴더에 파일저장
    // const readStream = createReadStream();
    // const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
    // readStream.pipe(writeStream);
    // avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }

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
        bio,
        ...(uglyPassword && { password:uglyPassword }),
        ...(avatarUrl && { avatar: avatarUrl}),
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
