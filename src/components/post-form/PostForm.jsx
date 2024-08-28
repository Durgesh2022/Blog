import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "..";
import Input1 from "../input1";
import Textarea from "../Textarea";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue } = useForm({
        defaultValues: {
            title: post?.title || "",
            description: post?.description || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");
        }
        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    // Function to validate description length
    const validateDescription = (value) => {
        const wordCount = value.split(/\s+/).length;
        return wordCount <= 800 || "Content must be up to 800 words";
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-8 space-y-4">
                <Input1
                    label="Title :"
                
                    placeholder="Title"
                    className="mr-2 opacity-50  " // 50% transparency
                    {...register("title", { required: true })}
                />
                <Textarea
                    label="Content :"
                    placeholder="content"
                    {...register("content", { validate: validateDescription })}
                    className="w-full p-2 border border-black rounded opacity-50" // 50% transparency
                    rows={8}
                />
            </div>
            <div className="w-1/3 px-2">
                <div className="mb-4 p-4 rounded-lg h-72 flex flex-col justify-end" style={{
                    backgroundImage: `url('/image.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    <Input
                        label="Featured Image :"
                        type="file"
                        className="mb-4 opacity-50" // 50% transparency
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {post && (
                        <div className="w-full mb-4">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                </div>
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4 opacity-50 bg-black" // 50% transparency
                    {...register("status", { required: true })}
                />
                </div>
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-80 mx-auto">
                    {post ? "Update" : "Submit"}
                </Button>
            
        </form>
    );
}
