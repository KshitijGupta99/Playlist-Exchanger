import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET as string,
      authorization: "https://accounts.spotify.com/authorize?scope=playlist-read-private playlist-modify-public",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
        if (account) {
            token.accessToken = account.access_token;
        }
        return token;
    },
    async session({ session, token }) {
        session.accessToken = token.accessToken;
        return session;
    },
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
