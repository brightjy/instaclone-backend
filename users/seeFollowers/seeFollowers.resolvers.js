import client from "../../client";

export default {
  Query: {
    seeFollowers: async(_, {userName, page}) => {
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
      // 방법1. 호날두 프로필에 가서 그의 팔로워를 찾는 방식 -> 데이터 과부하 초래 가능성
      const followers = await client.user
        .findUnique({where:{userName}})
        .followers({
          // offset pagination
          take: 5,
          skip: (page - 1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: {following: {some:{userName}}},
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      }

      // 방법2. 호날두 프로필을 보러 간 사람의 팔로잉 중에 호날두가 있는지 찾는 방식
      // const bFollowers = await client.user 
      //   .findMany({where:{
      //     following: {
      //       some: {
      //         userName,
      //       },
      //     },
      //   },
      // });
    },
  },
};