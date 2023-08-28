import { PostDatabase } from "../database/PostDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManger: TokenManager
    ){}

    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {
        const { content, token } = input

        const payload = this.tokenManger.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const id = this.idGenerator.generate()

        const post = new Post(
            id,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name     
        )

        await this.postDatabase.insertPost(post.toDbModel())

        const output: CreatePostOutputDTO = undefined

        return output
    }

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const { token } = input

        const payload = this.tokenManger.getPayload(token)

        if(!payload) {
            throw new UnauthorizedError()
        }

        const postsDBWithCreatorName = await this.postDatabase.getPostsWithCreatorName()
        const posts = postsDBWithCreatorName.map((postDBWithCreatorName) =>{
            const post = new Post(
                postDBWithCreatorName.id,
                postDBWithCreatorName.content,
                postDBWithCreatorName.likes,
                postDBWithCreatorName.dislikes,
                postDBWithCreatorName.created_at,
                postDBWithCreatorName.updated_at,
                postDBWithCreatorName.creator_id,
                postDBWithCreatorName.creator_name
            )

            return post.toBusinessModel()
        })

        const output: GetPostsOutputDTO = posts

        return output
    }
}