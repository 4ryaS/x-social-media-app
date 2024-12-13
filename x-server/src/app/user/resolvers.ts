const queries = {
    verify_google_token: async(parent: any, { token }:{ token: string }) => {
        return token;
    },
};

export const resolvers = { queries };