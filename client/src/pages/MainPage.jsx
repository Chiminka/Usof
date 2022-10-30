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
    const [search_ex, setSearch_ex] = useState([])
    const [new_posts, setNew_posts] = useState([])
    const [filting] = useState([])
    const [filt_post2] = useState([])
    let [flag] = useState(0)

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


    // Search and Filter
    posts.filter(post =>{
            try {
                if (search !== 'active' && search !== 'inactive') {
                    const app = search?.map((date)=>{
                        if (date.createdAt) {
                            return date
                        }  else return null
                    })
                    if( app[0] !== null && search !== 'likes' && search !== 'date' && search !== 'active' && search !== 'inactive') {
                        const filt_post = []
                        for(let j = 0; j<filting.length; j++){
                            for (let i = 0; i<search.length; i++) {
                                if (filting[j].title.toLowerCase().includes(search[i].title.toLocaleLowerCase())){
                                    filt_post.push(filting[j])
                                }
                            }
                        }
                        filting.length = 0
                        for (let i = 0; i<filt_post.length; i++)
                            filting.push(filt_post[i])
                    } 
                    else 
                    if (search.length > 1 && search !== 'likes' && search !== 'date' && search !== 'active' && search !== 'inactive') {
                        for (let i = 0; i<search.length; i++) {
                            if( post.title.toLowerCase().includes(search[i].toLocaleLowerCase())){
                                filting.push(post)
                            }
                        }
                    }
                }    
                if (!/[0-9]/i.test(search) && search !== 'likes' && search !== 'date') {
                    if (search.length > 0){
                        if (filting.length > 0) {
                            const filt_post = []
                            for (let i = 0; i<filting.length; i++) {
                                if(filting[i].status.toLowerCase() === (search.toLocaleLowerCase())) {
                                    filt_post.push(filting[i])
                                }
                            }
                            filting.length = 0
                            for (let i = 0; i<filt_post.length; i++)
                                filting.push(filt_post[i])
                        } else if (filting.length === 0) {
                            if(post.status.toLowerCase() === (search.toLocaleLowerCase())) {
                                filt_post2.push(post)
                            }
                        }
                    }
                }  

                if (/[a-za-яё0-9]/i.test(search) && search !== 'likes' && search !== 'date') {
                    for(let i = 0; i<search.length; i++){
                        if (post.categories.includes(search[i])) {
                            filting.push(post)
                        }
                    }
                }
            } catch (error) {
            }
     })

    for (let i = 0; i<filt_post2.length; i++)
        filting.push(filt_post2[i])

    posts.filter(post =>{
        if (search_ex.length > 0){
            if(post.text.toLowerCase().includes(search_ex.toLocaleLowerCase()) || post.title.toLowerCase().includes(search_ex.toLocaleLowerCase())){
                flag = 1
                filting.push(post)
            } 
        }
    })

    const makeUniq = (arr) => {
        const uniqSet = new Set(arr);
        return [...uniqSet];
    }


    let new_filted_posts = makeUniq(filting)
    
    // if (flag === 1)
    //     filting.length = 0
    

    const removePostHandler = () => {
        window.location.reload(true)
    }

    // Sort
    if (search === 'likes') {
        const numDescending = new_filted_posts.length > 0 ? [...new_filted_posts].sort((a, b) => b.likes - a.likes) : [...posts].sort((a, b) => b.likes - a.likes)
        new_filted_posts = numDescending
    } else if (search === 'date') {
       const numDescending = new_filted_posts.length > 0 ? [...new_filted_posts].sort((a, b) => new Date(b.createdAt).setHours(0, 0, 0, 0) - new Date(a.createdAt).setHours(0, 0, 0, 0)) : [...posts].sort((a, b) => new Date(b.createdAt).setHours(0, 0, 0, 0) - new Date(a.createdAt).setHours(0, 0, 0, 0))
        new_filted_posts = numDescending
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
            if (filting.length > 0) {
                switch (number) {
                case '3':{
                    if (date.getFullYear() === year)
                        mas.push(time)
                    break;
                }
                case '4':{
                    if (date.getMonth()+1 === month)
                        mas.push(time)
                     break;
                }
                case '5':{
                    if (date.getDate() > week)
                        mas.push(time)
                        break;
                    }
                }
            } else {
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
                    onChange={(e)=>setSearch_ex(e.target.value)} placeholder='Search...'/>
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
