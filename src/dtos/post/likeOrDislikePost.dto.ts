import z from 'zod'

export interface LikeOrDislikePlaylistInputDTO {
    postId: string,
    token: string,
    like: boolean
}

export type LikeOrDislikePostOutputDTO = undefined

export const LikeOrDislikePostSchema = z.object({
    postId: z.string().min(1),
    token: z.string(),
    like: z.boolean()
})