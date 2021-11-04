import client from "../../client";

export default {
  Query: {
    seePhotoComments: (_, {id}) => 
      client.comment.findMany({
        where: {
          photoId: id,
        },
        // 페이징할거면여기서
        orderBy: {
          createdAt: "asc",
        }
      })
  }
}