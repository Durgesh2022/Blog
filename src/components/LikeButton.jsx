import React, { useState, useEffect } from "react";
import "./like.css";
import authService from "../appwrite/auth";
import likeService from "../appwrite/LikeService";
import service from "../appwrite/config";

export default function LikeButton() {
    const [liked, setLiked] = useState(false);
    const [likesAmount, setLikesAmount] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);

            if (user) {
                // Check if the user has already liked
                const userLiked = await likeService.getUserLikeStatus(user.$id);
                setLiked(userLiked);

                // Update the like count
                const likeCount = await likeService.getLikeCount();
                setLikesAmount(likeCount);
            }
        };

        fetchData();
    }, []);

    const handleClick = async () => {
      setLiked(!liked);
      setLikesAmount(liked ? likesAmount - 1 : likesAmount + 1);
        if (!currentUser) {
            alert("Please log in to like this.");
            return;
        }

        try {
            // Toggle the like status and update the like count
            const newLikesAmount = await likeService.toggleLike(currentUser.$id);
            setLiked(!liked); // Toggle liked state
            setLikesAmount(newLikesAmount); // Update like count
        } catch (error) {
            console.error("Error toggling like:", error);
        }
    };

    return (
        <div className="like-button">
            <div className="heart-bg" onClick={handleClick}>
                <div className={`heart-icon ${liked ? "liked" : ""}`}></div>
            </div>
            <div className="likes-amount">{likesAmount} likes</div>
            
        </div>
    );
}
