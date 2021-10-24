import * as jwt from "jsonwebtoken";
import client from "../client";

export const getUser = async(authorization) => {
  try {
    if(!authorization) {
      return null;
    }
    const verifiedToken:any = await jwt.verify(authorization, process.env.PRIVATE_KEY);   
    if("id" in verifiedToken) {
      const user = await client.user.findUnique({ 
        where: { id:verifiedToken["id"] }, 
      });
      if(user) {
        return user;
      }
    }
    return null;
  } catch {
    return null;
  }
};

// export const protectResolver = (ourResolver) => (
//   root, 
//   args, 
//   context, 
//   info
//   ) => {
//   if (!context.loggedInUser) {
//     return {
//       ok: false,
//       error: "Please log in to perform this action.",
//     };
//   }
//   return ourResolver(root, args, context, info);
// };

export function protectResolver(ourResolver) {
  return function(root, args, context, info) {
    if (!context.loggedInUser) {
      return {
        ok: false,
        error: "Please log in to perform this action.",
      };
    }
    return ourResolver(root, args, context, info);
  };
}