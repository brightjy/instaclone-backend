import client from "../../client";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    uploadPhoto: protectResolver(
      async(_, {file, caption}, {loggedInUser}) => {
        let hashtagObjs = [];
        if(caption) {
          hashtagObjs = processHashtags(caption)
          // parse caption
          // const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
          // get or create Hashtags 
          // hashtagObjs = hashtags.map(hashtag => ({
          //   where: {hashtag}, 
          //   create: {hashtag},
          // }));
        }
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              },
            },
            ...(hashtagObjs.length > 0 && {
              hashtags: {
                connectOrCreate: hashtagObjs,
              },
            }),
          },
        });
        // save the photo with parsed hashtags
        // add tho photo to the hashtags
      }
    ),
  }
};