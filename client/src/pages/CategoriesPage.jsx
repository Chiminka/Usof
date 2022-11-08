import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Moment from 'react-moment'
import axios from '../utils/axios'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createCategory} from '../redux/features/category/categorySlice'
import { toast } from 'react-toastify'
import { Grid } from '@mui/material';

export const CategoriesPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [categories, setCategory] = useState([])
    const categoryArr = categories.categories
    const { user } = useSelector((state) => state.auth)
    const { status } = useSelector((state) => state.category)
    

    const dispatch = useDispatch()

    function onLoad (){
        if(!window.location.hash){
            window.location=window.location+'#loaded'
            window.location.reload()
        }
    }

    useEffect(() => {
        if (status) {
            toast(status)
        }
    }, [status])

    const submitHandler = () => {
        try {
            let formData = new FormData()
            formData.append('title', title)
            formData.append('description', text)
            dispatch(createCategory(formData))
        } catch (error) {
            console.log(error)
        }
    }
    const clearFormHandler = () => {
        setText('')
        setTitle('')
    }


    const fetchAllCategories = async () => {
        try {
            const { data } = await axios.get('/categories')
            setCategory(data)
 
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAllCategories()
    }, [])

        if (!categoryArr) {
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
                <div>
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
                        Text of the category:
                        <textarea
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        placeholder='Text'
                        className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none resize-none h-40 placeholder:text-gray-700'
                        />
                    </label>
                    <div className='flex gap-8 items-center justify-center mt-4'>
                    <button
                        onClick={submitHandler}
                        className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'
                    >
                    Add
                    </button>

                    <button
                        onClick={clearFormHandler}
                        className='flex justify-center items-center bg-red-500 text-xs text-white rounded-sm py-2 px-4'
                    >
                    Clear
                    </button> 
                    </div>
                </div>
            )
        }
    }

    const grid = () => {
        return (
        <Grid item xs={12}>
        <Grid container justifyContent="center" spacing={2}>
          {categoryArr.map((category, idx) => (
            <Grid key={idx} item sx={{
                  height: 140,
                  width: 100,
                }}>
                 <Link to={`/categories/${category._id}`}>
                            <div className='flex flex-col basis-1/4 flex-grow'>
                                <div className='flex justify-between items-center pt-2'>
                            </div>
                            <div className='text-white text-xl'>{category.title}</div>
                                <p className='text-white opacity-60 text-xs pt-4 line-clamp-4'>
                                    {category.description}
                                </p>
                            </div>
                            <div className='text-xs text-white opacity-50'>
                                    <Moment date={category.createdAt} format='D MMM YYYY' />
                            </div>
                        </Link>

            </Grid>
          ))}
        </Grid>
      </Grid>
        )
    }
    
    return (
        <div onLoad={onLoad()} className='max-w-[900px] mx-auto py-10'>
            <div className='flex justify-between gap-8'>
                <div className='flex flex-col gap-10 basis-4/5'>
                    {rights()} 
                    {grid()}
                     {/* {categoryArr?.map((category, idx) => (
                        <Link to={`/categories/${category._id}`}>
                            <div className='flex flex-col basis-1/4 flex-grow'>
                                <div className='flex justify-between items-center pt-2'>
                            </div>
                            <div className='text-white text-xl'>{category.title}</div>
                                <p className='text-white opacity-60 text-xs pt-4 line-clamp-4'>
                                    {category.description}
                                </p>
                            </div>
                            <div className='text-xs text-white opacity-50'>
                                    <Moment date={category.createdAt} format='D MMM YYYY' />
                            </div>
                        </Link>
                    ))} */}
                </div>
            </div>
        </div>
    )
}