import { graphql_client } from "@/clients/api"
import { CreatePostData } from "@/gql/graphql"
import { create_post_mutation } from "@/graphql/mutation/post"
import { get_all_posts_query } from "@/graphql/query/post"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useCreatePost = () => {
    const query_client = useQueryClient();
    const mutation = useMutation({
        mutationFn: async (payload: CreatePostData) => await graphql_client.request(create_post_mutation, {payload}),
        onMutate: () => toast.loading("Creating Post!", {id: '1'}),
        onSuccess: async () => {
            await query_client.invalidateQueries({ queryKey: ['all-posts']});
            toast.success("Post Created!", {id: '1'})
        },
    });

    return mutation;
}

export const useGetAllPosts = () => {
    const query = useQuery({
        queryKey: ['all-posts'],
        queryFn: async () => await graphql_client.request(get_all_posts_query)
    });
    return { ...query, posts: query.data?.get_all_posts}
};