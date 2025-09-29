import NextAuth from 'next-auth/next';
import User from '../../../models/users';
import connectDB from '../../../utils/mongodb';
import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions = {
	session: {
		strategy: 'jwt' as const,
	},
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {},
				password: {},
			},
			async authorize(credentials) {
				try {
					await connectDB();

					const { email, password } = credentials as { email: string; password: string };

					if (!email || !password) {
						throw new Error('Email and password are required');
					}

					const user = await User.findOne({ email });
					if (!user) {
						throw new Error('No user found with the provided email');
					}

					const isPasswordValid = await bcrypt.compare(password, user.password);
					if (!isPasswordValid) {
						throw new Error('Invalid password');
					}

					return { 
						id: String(user._id), 
						email: user.email, 
						name: user.fullName, 
						role: user.role 
					};
				} catch (error) {
					console.error('Error in authorize:', error);
					throw new Error('Authorization failed');
				}
			},
		}),
	],
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async jwt({ token, user }: { token: any; user?: any }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.role = user.role; 
			}
			return token;
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async session({ session, token }: { session: any; token: any }) {
			if (token) {
				session.user = {
					id: token.id,
					email: token.email,
					name: token.name,
					role: token.role,
				};
			}
			return session;
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
