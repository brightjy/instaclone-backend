import client from "../../client"

export default {
  Query: {
    // cursor based pagination 은 무제한 스크롤에 유용하다. (단점: 특정 페이지로의 이동은 어려움)
    seeFollowing: async(_, {userName, lastId}) => {
      const ok = await client.user.findUnique({
        where: {userName},
        select: {id: true},
      });
      if(!ok) {
        return {
          ok: false,
          error: "User not found",
        };
      }
      const following = await client.user
        .findUnique({where: {userName}})
        .following({
          take: 5,
          skip: lastId? 1 : 0,
          ...(lastId && {cursor: {id: lastId}}),
        });
        return {
          ok: true,
          following,
        }
    },
  },
};