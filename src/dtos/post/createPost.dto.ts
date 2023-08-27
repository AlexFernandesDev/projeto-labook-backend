import z from 'zod'

export interface CreatePostInputDTO {
    content: string
}

export type CreatePostOutputDTO = undefined

export const CreatePostSchema = z.object({
    content: z.string().min(1).max(500),
})