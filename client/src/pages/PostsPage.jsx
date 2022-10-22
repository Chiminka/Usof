import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { PostItem} from '../components/PostItem'
import axios from '../utils/axios'
import {Pagination} from '../components/Pagination'

export const PostsPage = () => {
    const [posts, setPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)

    const fetchMyPosts = async () => {
        try {
            const { data } = await axios.get('/users/posts')
            setPosts(data)
 
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMyPosts()
    }, [])

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    
    return (
        <div className='w-1/2 mx-auto py-10 flex flex-col gap-10'>
            {currentPosts?.map((post, idx) => (
                <PostItem post={post} key={idx} />
            ))}
            <div className='max-w-[900px] mx-auto py-10'>
                <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
            </div>
        </div>
    )
}