import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook";


export default NextAuth({


        providers: [
            GoogleProvider({
              clientId:'72464777062-aig9lehukpcf5ptvhaejnlg13alhejm5.apps.googleusercontent.com',
              clientSecret: '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',
            }),
            FacebookProvider({
              clientId:'950247109611197',
              clientSecret: 'b01c223239d232f0e2259b5e5a02a927',
            })
    ],
    callbacks: {
 
    async session({ session, user, token }) {
      console.log('token session:>> ', token);
      let last;
      for(last in token?.token);
      last;
      console.log('last :>> ', last);
      session.myusers=token
      return session;
    },
    async jwt(token, user) {
      console.log('token jwt :>> ', token );
      if(token.account){
        const users={TTT:'rrejtreneyyt6357268hgjjfghjaososnsbtrbee4erey6et8e754h3g4u'}
        return {...users}
      }
      
      return {...token,...user}
    }}
})