import React from 'react'
import { AiFillEye, AiOutlineMessage, AiFillLike } from 'react-icons/ai'
import Moment from 'react-moment'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../utils/axios'
import { CategoryItem } from '../components/CategoryItem'
import { useCallback } from 'react'

export const PostItem = ({ post }) => {
    const [comments, setComments] = useState([])
    const [categories, setCategories] = useState([])
    const [user, setUser] = useState([])
    
    const fetchAllUser = useCallback(async () => {
        const { data } = await axios.get(`/users`)
        setUser(data)
    }, [])

    const fetchPostComments = useCallback(async () => {
        const { data } = await axios.get(`/posts/${post._id}/comments`)
        setComments(data)
    }, [post._id])

    const fetchPostCategories = useCallback(async () => {
        const { data } = await axios.get(`/posts/${post._id}/categories`)
        setCategories(data)
    }, [post._id])

    useEffect(() => {
        fetchAllUser()
    }, [fetchAllUser])

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

    const author = () => {
        const userArr = []
        user.users?.map((author, idx)=>{
           return userArr.push(author)
        })
        for ( let i = 0; i<userArr.length; i++){
            if (post.author === userArr[i]._id) {
                return userArr[i].username
            }
        }
    }

    return (
        <Link to={`/posts/${post._id}`}>
            <div className='flex flex-col basis-1/4 flex-grow mt-10'>
                <div className='flex justify-between items-center pt-2 text-sm text-white opacity-19'>
                      {author()}
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
                    <button className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                        <AiFillLike />{' '}
                        <span>{post.likes || 0} </span>
                    </button>
                    <span>{categories.map((category) => (
                            <CategoryItem key={category._id} category={category} />
                        ))}
                    </span>
                </div>
                <div className='text-xs text-white opacity-50'>
                </div>
            </div>
        </Link>
    )
}
