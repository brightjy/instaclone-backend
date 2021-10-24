import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
  Mutation: {
    uploadPhoto: protectResolver(
      async(_, {file, caption}, {loggedInUser}) => {
        let hashtagObjs = [];
        if(caption) {
          // parse caption
          const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
          // get or create Hashtags 
          hashtagObjs = hashtags.map(hashtag => ({
            where: {hashtag}, 
            create: {hashtag},
          }));
          console.log(hashtagObjs);
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