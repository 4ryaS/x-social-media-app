import { graphql_client } from "@/clients/api";
import { delete_repost_mutation, like_post_mutation, repost_post_mutation, unlike_post_mutation } from "@/graphql/mutation/user";
import { get_current_user_query, get_user_by_id_query } from "@/graphql/query/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

export const useLikePost = () => {
  // const query_client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (post_id: string) => await graphql_client.request(like_post_mutation, { post_id }),
    onMutate: () => toast.loading("Liking Post!", { id: '1' }),
    onSuccess: async () => {
      // await query_client.invalidateQueries({ queryKey: ['all-posts']});
      toast.success("Post Liked!", { id: '1' })
    },
  });

  return mutation;
};

export const useUnlikePost = () => {
  // const query_client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (post_id: string) => await graphql_client.request(unlike_post_mutation, { post_id }),
    onMutate: () => toast.loading("Unliking Post!", { id: '1' }),
    onSuccess: async () => {
      // await query_client.invalidateQueries({ queryKey: ['all-posts']});
      toast.success("Post Unliked!", { id: '1' })
    },
  });

  return mutation;
};

export const useRepostPost = () => {
  // const query_client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (post_id: string) => await graphql_client.request(repost_post_mutation, { post_id }),
    onMutate: () => toast.loading("Reposting!", { id: '1' }),
    onSuccess: async () => {
      // await query_client.invalidateQueries({ queryKey: ['all-posts']});
      toast.success("Repost Successful!", { id: '1' })
    },
  });

  return mutation;
};

export const useDeleteRepost = () => {
  // const query_client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (post_id: string) => await graphql_client.request(delete_repost_mutation, { post_id }),
    onMutate: () => toast.loading("Deleting Repost!", { id: '1' }),
    onSuccess: async () => {
      // await query_client.invalidateQueries({ queryKey: ['all-posts']});
      toast.success("Repost Deleted!", { id: '1' })
    },
  });

  return mutation;
};