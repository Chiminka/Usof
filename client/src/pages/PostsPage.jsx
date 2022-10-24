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
    const [search, setSearch] = useState([])

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

    let filteredPosts =  posts.filter(post =>{
        return post.title.toLowerCase().includes(search.toString().toLowerCase())
    })

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
    
    return (
        <div className='w-1/2 mx-auto py-10 flex flex-col gap-10'>
            <div>
                <input  className='mb-5 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                    onChange={(e)=>setSearch(e.target.value)} placeholder='Search...'/>
            </div>
            {currentPosts?.map((post, idx) => (
                <PostItem post={post} key={idx} />
            ))}
            <div className='max-w-[900px] mx-auto py-10'>
                <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
            </div>
        </div>
    )
}