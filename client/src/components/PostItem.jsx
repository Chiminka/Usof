import React from 'react'
import { AiFillEye, AiOutlineMessage } from 'react-icons/ai'
import Moment from 'react-moment'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../utils/axios'
import { CategoryItem } from '../components/CategoryItem'
import { useCallback } from 'react'

export const PostItem = ({ post }) => {
    const [comments, setComments] = useState([])
    const [categories, setCategories] = useState([])

    const fetchPostComments = useCallback(async () => {
        const { data } = await axios.get(`/posts/${post._id}/comments`)
        setComments(data)
    }, [post._id])

    const fetchPostCategories = useCallback(async () => {
        const { data } = await axios.get(`/posts/${post._id}/categories`)
        setCategories(data)
    }, [post._id])

     useEffect(() => {
        fetchPostComments()
    }, [fetchPostComments])

    useEffect(() => {
        fetchPostCategories()
    }, [fetchPostCategories])

    if (!post) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Downloading...
            </div>
        )
    }

    return (
        <Link to={`/${post._id}`}>
            <div className='flex flex-col basis-1/4 flex-grow'>
                {/* <div
                    className={
                        post.imgUrl ? 'flex rouded-sm h-80' : 'flex rounded-sm'
                    }
                >
                    {post.imgUrl && (
                        <img
                            src={`http://localhost:3002/${post.imgUrl}`}
                            alt='img'
                            className='object-cover w-full'
                        />
                    )}
                </div> */}
                <div className='flex justify-between items-center pt-2'>
                    <div className='text-xs text-white opacity-50'>
                        {post.username}
                    </div>
                    <div className='text-xs text-white opacity-50'>
                        <Moment date={post.createdAt} format='D MMM YYYY' />
                    </div>
                </div>
                <div className='text-white text-xl'>{post.title}</div>
                <p className='text-white opacity-60 text-xs pt-4 line-clamp-4'>
                    {post.text}
                </p>

                <div className='flex gap-3 items-center mt-2'>
                    <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                        <AiFillEye /> <span>{post.views}</span>
                    </button>
                    <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                        <AiOutlineMessage />{' '}
                        <span>{comments?.length || 0} </span>
                    </button>
                    <span>{categories.map((category) => (
                            <CategoryItem key={category._id} category={category} />
                        ))}</span>
                </div>
            </div>
        </Link>
    )
}
