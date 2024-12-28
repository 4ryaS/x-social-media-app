import { graphql_client } from "@/clients/api";
import { get_current_user_query, get_user_by_id_query} from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      try {
        return await graphql_client.request(get_current_user_query);
      } catch (error) {
        console.error("Error fetching current user:", error);
        throw new Error("Failed to fetch current user");
      }
    },
  });

  return { ...query, user: query.data?.get_current_user };
}

export const useGetUserById = (id: string) => {
  const query = useQuery({
    queryKey: ["get-user-by-id"],
    queryFn: async () => await graphql_client.request(get_user_by_id_query, { id }),
  });
  return { ...query, user: query.data?.get_user_by_id };
};