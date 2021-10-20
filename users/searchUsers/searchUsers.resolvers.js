import client from "../../client"

export default {
  Query: {
    searchUsers: async(_, {keyword}) => 
      client.user.findMany({
        where: {
          userName: {
            startsWith: keyword.toLowerCase(),
          },
        },
        // todo: 페이징 구현하기
      }),
  },
};