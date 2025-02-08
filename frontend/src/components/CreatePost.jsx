import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useRef, useState } from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import { readFileDataURL } from '@/lib/utils';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { setPosts, addPost } from '@/redux/postSlice';
import { BASE_URL } from '@/config/apiConfig';

export default function CreatePost({ open, setOpen }) {

    const imageRef = useRef();
    const [image, setImage] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const dataUrl = await readFileDataURL(file);

            setImagePreview(dataUrl);

        }
    }

    const postHandler = async () => {
        const formData = new FormData();
        formData.append('caption', caption);
        if (imagePreview) formData.append('image', image);

        setLoading(true); // Set loading to true

        try {
            let response = await fetch(`${BASE_URL}/api/v1/post/addpost`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            response = await response.json();

            if (response.success) {
                console.log(response.message); // Show success toast
                setOpen(false);
                setImage("");
                setCaption("");
                setImagePreview("");
                // posts.append(response.post);     --> can't use this because we can not directly update redux state, we have to make
                // dispatch(setPosts(posts))            function in post slice to do this
                dispatch(addPost(response.post));
            } else {
                console.log(response.message); // Show error toast
            }
        } catch (error) {
            console.log(error.message); // Show error toast
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const ousideIntractionHandler = () => {
        setOpen(false);
        setImage("");
        setCaption("");
        setImagePreview("");

    }

    return (
        <>
            <Dialog open={open}>
                <DialogContent onInteractOutside={ousideIntractionHandler} className="rounded-xl w-[90%] max-w-lg" >
                    <div className="flex flex-col items-center w-full min-h-[250px]">
                        <h1 className='flex w-full justify-center font-semibold text-lg'>Create New Post</h1>

                        {
                            imagePreview && (
                                <div>
                                    <div className="flex justify-between items-center border-b ml-3">
                                        <input type="text" placeholder="Add caption..." className="outline-none text-sm w-full mb-3 mt-1" value={caption} onChange={(e) => { setCaption(e.target.value) }} />
                                    </div>
                                    <img src={imagePreview} alt='post image' className='rounded-xl mb-2 aspect-square' />
                                </div>)
                        }

                        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />

                        <button className="p-2 bg-blue-500 hover:bg-blue-700 rounded-[10px] shadow-sm shadow-black my-auto items-center" onClick={() => imageRef.current.click()}>Select a photo</button>

                        {
                            imagePreview && <button className="p-2 bg-violet-800 hover:bg-violet-950 rounded-[10px] shadow-sm shadow-black my-2 items-center justify-center flex w-full" onClick={postHandler}>
                                {loading && <Loader2 className="w-4 h-4 text-white animate-spin" />}
                                {!loading && "Post"}
                            </button>
                        }
                    </div>
                </DialogContent>
            </Dialog>
            <ToastContainer />
        </>
    )
}
