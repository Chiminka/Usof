import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Moment from 'react-moment'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from '../utils/axios'
import {getCategoryPosts} from '../redux/features/category/categorySlice'
import { PostItem } from '../components/PostItem'
import {
    AiTwotoneEdit,
    AiFillDelete,
} from 'react-icons/ai'
import { toast } from 'react-toastify'
import { removeCategory } from '../redux/features/category/categorySlice'
import Modal from '../components/Modal'
import { updateCategory } from '../redux/features/category/categorySlice'
import {Pagination} from '../components/Pagination'

export const CategoryPage = () => {
    const [categories, setCategory] = useState(null)
    const { posts } = useSelector((state) => state.category)
    const { user } = useSelector((state) => state.auth)
    const [modalActive, setModalActive] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)

    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitHandler = () => {
        try {
            const id = params.id
            dispatch(updateCategory({id, title, description}))
            toast('Category updated')
            navigate('/categories')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchPosts = useCallback(async () => {
        try {
            dispatch(getCategoryPosts(params.id))
        } catch (error) {
            console.log(error)
        }
    }, [params.id, dispatch])

    const fetchCategory = useCallback(async () => {
        const { data } = await axios.get(`/categories/${params.id}`)
        setCategory(data)
        setTitle(data.title)
        setDescription(data.description)

    }, [params.id])

    useEffect(() => {
        fetchCategory()
    }, [fetchCategory])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const removePostHandler = () => {
        try {
            const post_id = []
            {posts?.map((post, idx) => (
                post_id.push(post._id)
            ))}
            const id = params.id
            dispatch(removeCategory({id, post_id}))
            toast('Post was deleted')
            navigate('/categories')
        } catch (error) {
            console.log(error)
        }
    }

    if (!categories || !posts) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Downloading...
            </div>
        )
    }

    const rights = () =>{
        if(!user) 
            <div>Loading...</div>
        else if (user.role === 'admin') {
            return(
                <div className='flex gap-3 mt-4'>
                <button className='flex items-center justify-center gap-2 text-white opacity-50'>
                    <button onClick={()=>setModalActive(true)}>
                        <AiTwotoneEdit />
                    </button>
                </button>
                <button
                    onClick={removePostHandler}
                    className='flex items-center justify-center gap-2  text-white opacity-50'
                >
                    <AiFillDelete />
                </button>
                <Modal active={modalActive} setActive={setModalActive}>
                     <label className='text-xs text-white opacity-70'>
                Title of category:
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Title'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                Text of category:
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder='Text'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none resize-none h-40 placeholder:text-gray-700'
                />
            </label>
            <div>
                <button
                    onClick={submitHandler}
                    className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'
                >
                    Update
                </button>
            </div>
                </Modal>
                </div>
            )
        }
    }

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    return (
        <div>
            <button className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'>
                <Link className='flex' to='/categories'>
                    Back
                </Link>
            </button>
            <div className='flex flex-col basis-1/4 flex-grow'>
                <div className='flex justify-between items-center pt-2'>
            </div>
            <div className='text-white text-xl'>{categories.title}</div>
                <p className='text-white opacity-60 text-xs pt-4 line-clamp-4'>
                    {categories.description}
                </p>
            </div>
            <div className='text-xs text-white opacity-50'>
                <Moment date={categories.createdAt} format='D MMM YYYY' />
            </div>
            {rights()}
            <div className='mt-20'>
                 {currentPosts?.map((post, idx) => (
                    <PostItem post={post} key={idx} />
            ))}
            </div>
            <div className='max-w-[900px] mx-auto py-10'>
                <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
            </div>
        </div>
    )
}
