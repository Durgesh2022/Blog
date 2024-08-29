import conf from '../conf/conf.js';
import { Client, Databases, ID, Query } from "appwrite";
import service from "./config.js";

export class LikeService {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
    }

    async toggleLike(userId) {
        try {
            // Check if the user has already liked
            const existingLike = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal('userId', userId)
                ]
            );

            if (existingLike.total > 0) {
                // User has already liked, so remove the like
                await this.databases.deleteDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    existingLike.documents[0].$id
                );
            } else {
                // User hasn't liked, so add a new like
                await this.databases.createDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId,
                    ID.unique(),
                    {
                        userId: userId,
                        // Ensure other required fields are included if needed
                    }
                );
            }

            // Get and return the updated like count
            return await this.getLikeCount();
        } catch (error) {
            console.error("LikeService :: toggleLike :: error", error);
            throw error;
        }
    }

    async getLikeCount() {
        try {
            const likes = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );
            return likes.total;
        } catch (error) {
            console.error("LikeService :: getLikeCount :: error", error);
            throw error;
        }
    }

    async getUserLikeStatus(userId) {
        try {
            const existingLike = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                [
                    Query.equal('userId', userId)
                ]
            );
            return existingLike.total > 0;
        } catch (error) {
            console.error("LikeService :: getUserLikeStatus :: error", error);
            throw error;
        }
    }
}

const likeService = new LikeService();
export default likeService;
