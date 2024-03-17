import User from "@/app/models/User";
import NextAuth, { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

// type Creds = {email: string, password: string} ;

// export const authOptions = {
//   secret: process.env.SECRET,
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET
//     }),
//     CredentialsProvider({
//       name: "credentials",
//       id: 'credentials',
//       // credentials: {
//       //   username: { label: "Email", type: "email", placeholder: "test@example.com" },
//       //   password: { label: "Password", type: "password" },
//       // },
//       async authorize(credentials, req) {
//         const {email, password} = credentials;
//         connect();

//         try {
//           const user = await User.findOne({email});

//           if(user){
//             const isMatch = await bcryptjs.compare(password, user.password);
//             if(isMatch) {
//               return user;
//             }
//           }
//         return null;
//         } catch(err){
//           console.log("Error: ", err);
//         }
        
//       },
//     }),
//   ],
//   session: {
//     strategy: 'jwt'
//   },
// };

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
