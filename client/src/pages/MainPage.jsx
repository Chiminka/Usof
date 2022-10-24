import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PopularPosts } from '../components/PopularPosts'
import { PostItem } from '../components/PostItem'
import { getAllPosts } from '../redux/features/post/postSlice'
import {Pagination} from '../components/Pagination'
import { getAllCategories } from '../redux/features/category/categorySlice'
import { checkIsAuth } from '../redux/features/auth/authSlice'


export const MainPage = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(checkIsAuth)
    const { posts, popularPosts } = useSelector((state) => state.post)
    const {categories} = useSelector((state) => state.category)
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)
    const { user } = useSelector((state) => state.auth)
    const [search, setSearch] = useState([])
    const [new_posts, setNew_posts] = useState([])
    const [filting] = useState([])

    useEffect(() => {
        dispatch(getAllPosts())
    }, [dispatch])

    useEffect(() => {
        dispatch(getAllCategories())
    }, [dispatch])

    function onLoad (){
        if(!window.location.hash){
            window.location=window.location+'#loaded'
            window.location.reload()
        }
    }

    if (!isAuth) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Sign in first
            </div>
        )
    }
    else if (!posts) {
        return (
            <div className='text-xl text-center text-white py-10'>
                None posts.
            </div>
        )
    }

    let filteredPosts = []
    // Search and Filter
    filteredPosts =  posts.filter(post =>{
            try { 
                if(search.length > 1 && search !== 'likes' && search !== 'date' && search !== 'active' && search !== 'inactive')
                    for (let i = 0; i<search.length; i++) {
                        if(post.title.toLowerCase().includes(search[i].toLocaleLowerCase())){
                            filting.push(post)
                            return post.title.toLowerCase().includes(search[i].toLocaleLowerCase())
                        }
                    }
                if (!/[0-9]/i.test(search) && search !== 'likes' && search !== 'date') {
                    if(post.title.toLowerCase().includes(search.toLocaleLowerCase())){
                        filting.push(post)
                        return post.title.toLowerCase().includes(search.toLocaleLowerCase())
                    }
                    if(post.status.toLowerCase() === (search.toLocaleLowerCase())  && search !== 'likes' && search !== 'date') {
                        filting.push(post)
                        return post
                    }
                }
                if (/[a-za-яё0-9]/i.test(search) && search !== 'likes' && search !== 'date') {
                    for(let i = 0; i<search.length; i++){
                        if (post.categories.includes(search[i])) {
                            filting.push(post)
                            return post.categories.includes(search[i])
                        }
                    }
                }
            } catch (error) {
                return posts
            }
     })

    const makeUniq = (arr) => {
        const uniqSet = new Set(arr);
        return [...uniqSet];
    }

    console.log('filting', filting)
    let new_filted_posts = makeUniq(filting)

    const removePostHandler = () => {
        window.location.reload(true)
    }
    // console.log(new_posts)

    // Sort
    if (search === 'likes') {
        const numDescending = new_filted_posts.length > 0 ? [...new_filted_posts].sort((a, b) => b.likes - a.likes) : [...posts].sort((a, b) => b.likes - a.likes)
        new_filted_posts = numDescending
    } else if (search === 'date') {
        new_filted_posts = posts
    } 



    const Status = ()=>{
        if (user.role === 'admin') {
            return (
                <div>
                    <div className='pt-3 text-xs uppercase text-white'>
                        Status:
                    </div>
                    <div>
                        <input type="checkbox" name='active' className='active' id={1} onChange={function(){
                                let inp = document.getElementsByClassName('active')
                                    let length = inp.length
                                    let mas = ''
                                    for (let i = 0; i<length; i++) {
                                        if(inp[i].checked) {
                                            mas = inp[i].name
                                        }
                                    }
                                    setSearch(mas)
                        }}/>
                        <label className=' pl-3 text-xs text-white opacity-70'>Active</label>
                    </div>
                    <div>
                        <input type="checkbox" name='inactive' value='inactive' className='inactive' id={2} onChange={function(){
                                    let inp = document.getElementsByClassName('inactive')
                                    let length = inp.length
                                    let mas = ''
                                    for (let i = 0; i<length; i++) {
                                        if(inp[i].checked) {
                                            mas = inp[i].name
                                        }
                                    }
                                    setSearch(mas)
                        }}/>
                        <label className=' pl-3 text-xs text-white opacity-70'>Inactive</label>
                    </div>
                </div>
                                
            )
        }
    }

    const Dates = (number) =>{
        const date = new Date()
        // const allDates = []

        //если год равен этому году
        const year = date.getFullYear()
        //если месяц равен этому мясяцу
        const month = date.getMonth()+1
        //если дата дня больше этой даты дня
        const week = date.getDate()-7

        const mas = []
        posts?.map((time, index) => {  
            const date = new Date(Date.parse(time.createdAt))
            switch (number) {
                case '3':{
                    if (date.getFullYear() === year)
                        mas.push(time.title)
                    break;
                }
                case '4':{
                    if (date.getMonth()+1 === month)
                        mas.push(time.title)
                     break;
                }
                case '5':{
                    if (date.getDate() > week)
                        mas.push(time.title)
                     break;
                }
            }
            if (mas.length <= 1)
                setSearch(mas.toString())
            setSearch(mas)
        })
    }

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = new_posts.length > 0 ? new_posts.slice(indexOfFirstPost, indexOfLastPost) : new_filted_posts.length > 0 ? new_filted_posts.slice(indexOfFirstPost, indexOfLastPost) : posts.slice(indexOfFirstPost, indexOfLastPost)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)
   

    return (
        <div id="abc" onLoad={onLoad} className='max-w-[900px] mx-auto py-10'>
            <div>
                <input  className='mb-5 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                    onChange={(e)=>setSearch(e.target.value)} placeholder='Search...'/>
            </div>
            <div className='flex justify-between gap-8'>
                <div className='basis-1/5'>
                    <div className='md:font-bold text-xs uppercase text-white'>
                        Filter by ▼
                    </div>
                    <div className='pt-3 text-xs uppercase text-white'>
                        Category:
                    </div>
                    {categories.map((title, index) => {  
                        return ( 
                            <div>
                                <input type="checkbox"  className='category' id={index} name={title.title} value={title._id} onChange={function(){
                                    let inp = document.getElementsByClassName('category')
                                        let length = inp.length
                                        let mas = []
                                        for (let i = 0; i<length; i++) {
                                            if(inp[i].checked) {
                                                mas.push(inp[i].value)
                                            }
                                        }
                                        setSearch(mas)
                                }}/>
                                <label className='pl-3 text-xs text-white opacity-70' htmlFor={index}>{title.title}</label>
                            </div>
                            )
                        })
                    }
                    {Status()}
                    <div className=' pt-3 text-xs uppercase text-white'>
                        Date:
                    </div>
                    <div>
                        <input type="checkbox" className='year' id={3} onChange={function(){
                            let inp = document.getElementsByClassName('year')
                            let length = inp.length
                            let mas = ''
                            for (let i = 0; i<length; i++) {
                                if(inp[i].checked) {
                                     mas = '3'
                                }
                            }
                            Dates(mas)
                        }}/>
                        <label className=' pl-3 text-xs text-white opacity-70'>This year</label>
                    </div>
                    <div>
                        <input type="checkbox" className='month' id={4} onChange={function(){
                            let inp = document.getElementsByClassName('month')
                            let length = inp.length
                            let mas = ''
                            for (let i = 0; i<length; i++) {
                                if(inp[i].checked) {
                                     mas = '4'
                                }
                            }
                            Dates(mas)
                        }}/>
                        <label className=' pl-3 text-xs text-white opacity-70'>This month</label>
                    </div>
                    <div>
                        <input type="checkbox" className='week' id={5} onChange={function(){
                            let inp = document.getElementsByClassName('week')
                            let length = inp.length
                            let mas = ''
                            for (let i = 0; i<length; i++) {
                                if(inp[i].checked) {
                                     mas = '5'
                                }
                            }
                            Dates(mas)
                        }}/>
                        <label className=' pl-3 text-xs text-white opacity-70'>This week</label>
                    </div>
                    <div className='md:font-bold pt-4 text-xs uppercase text-white'>
                        Sort by ▼
                    </div>
                    <div className='pt-3 text-xs text-white opacity-70'>
                        <div><input className='likes' type="radio" name='sort' onChange={function(){
                            let inp = document.getElementsByClassName('likes')
                            let length = inp.length
                            let type = ''
                            for (let i = 0; i<length; i++) {
                                if(inp[i].checked) {
                                     type = 'likes'
                                }
                            }
                            setSearch(type)
                        }}/> Likes</div>
                        <div><input type="radio" className='date' name='sort' onChange={function(){
                            let inp = document.getElementsByClassName('date')
                            let length = inp.length
                            let type = ''
                            for (let i = 0; i<length; i++) {
                                if(inp[i].checked) {
                                     type = 'date'
                                }
                            }
                            setSearch(type)
                        }}/> Date (default)</div>
                    </div>
                    <div className='pt-6'>
                        <button
                                    onClick={removePostHandler}
                                    className='flex items-center justify-center gap-2  text-white opacity-50'
                                >
                                Reset
                        </button>
                    </div>
                </div>
                <div className='flex flex-col gap-10 basis-4/5'>
                    {currentPosts?.map((post, idx) => (
                        <PostItem key={idx} post={post}/>
                    ))}
                </div>
                <div className='basis-1/5'>
                    <div className='text-xs uppercase text-white'>
                        Famous:
                    </div>
                    {popularPosts?.map((post, idx) => (
                        <PopularPosts key={idx} post={post} />
                    ))}
                </div>
            </div>
            <div className='max-w-[900px] mx-auto py-10'>
                <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
            </div>
        </div>
    )
}
