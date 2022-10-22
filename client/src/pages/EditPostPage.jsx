import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { updatePost } from '../redux/features/post/postSlice'
import '../../src/add_post.css';

import axios from '../utils/axios'

export const EditPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [oldImage, setOldImage] = useState('')
    const [newImage, setNewImage] = useState('')
    const [status, setStatus] = useState('')
    const {categories} = useSelector((state) => state.category)
    const [editCategory, setEditCategory] = useState([])
    let [addCategories, setCategory] = useState([])
    const [categoriesTitle, setString] = useState([])

    //осталось только вывести
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const fetchPost = useCallback(async () => {
        const { data } = await axios.get(`/posts/${params.id}`)
        setTitle(data.title)
        setText(data.text)
        setOldImage(data.imgUrl)
        setStatus(data.status)
        let titles_mas = []
        let chosenCategory = []
        {categories?.map((title, index) => {  
            chosenCategory.push(title)   
        })}
        for (let i = 0; i<chosenCategory.length; i++) {                                                  
            titles_mas.push(chosenCategory[i].title)
        }
        setString(titles_mas.join('/'))
        
        let inp = document.getElementsByClassName('category')
        let length = inp.length
        const length2 = chosenCategory.length
        for (let i = 0; i<length; i++) {
            for (let j = 0; j < length2; j++) {
                if(inp[i].value === chosenCategory[j]._id) {
                    inp[i].checked = true
                }                                         
            }                                         
        }
    }, [params.id])

    const submitHandler = () => {
        try {
            const id = params.id
            let formData = new FormData()
            formData.append('title', title)
            formData.append('text', text)
            formData.append('status', status)
            formData.append('id', id)
            if (addCategories.length === 0) {
                addCategories = []
               formData.append('categories', addCategories)
            }
            for (let i = 0; i<addCategories.length; i++){
                formData.append('categories', addCategories[i])
            }
            formData.append('image', newImage) 

            dispatch(updatePost(formData))
            navigate('/main')
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setTitle('')
        setText('')
        setStatus('')
        setCategory('')
        navigate('/main')
    }

    const callFunction = async () => {
        const { data } = await axios.get(`/categories`)
        setEditCategory(data)
    }

    useEffect(() => {
        fetchPost()
        callFunction()
    }, [fetchPost])

    let chosenCategory = []
    {categories?.map((title, index) => {  
        return chosenCategory.push(title._id)   
    })}

    let allCategory = []
    {editCategory.categories?.map((title, index) => {  
        return allCategory.push(title._id)   
    })}
 
    return (
        <form
            className='w-1/3 mx-auto py-10'
            onSubmit={(e) => e.preventDefault()}
        >
            <label className='text-gray-300 py-2 bg-gray-600 text-xs mt-2 flex items-center justify-center border-2 border-dotted cursor-pointer'>
                Attach picture:
                <input
                    type='file'
                    className='hidden'
                    onChange={(e) => {
                        setNewImage(e.target.files[0])
                        setOldImage('')
                    }}
                />
            </label>
            <div className='flex object-cover py-2'>
                {oldImage && (
                    <img
                        src={`http://localhost:3002/${oldImage}`}
                        alt={oldImage.name}
                    />
                )}
                {newImage && (
                    <img
                        src={URL.createObjectURL(newImage)}
                        alt={newImage.name}
                    />
                )}
            </div>
            <label className='text-xs text-white opacity-70'>
                Title of post:
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder='Title'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                Text of post:
                <textarea
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    placeholder='Text'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none resize-none h-40 placeholder:text-gray-700'
                />
            </label>
           <div><span className="text-xs text-white opacity-70">{categoriesTitle}</span> </div>
            <label className='text-xs text-white opacity-70'>Change categories:</label>
             <div class="container">
  <ul class="ks-cboxtags">
    {editCategory.categories?.map((title, index) => {  
        return ( 
        <li>
            <input type="checkbox"  className='category' id={index} name={title.title} value={title._id} onChange={function(){
                                         let inp = document.getElementsByClassName('category')
                                        let length = inp.length
                                        let mas = []
                                        let titles_mas = []
                                        for (let i = 0; i<length; i++) {                                   
                                            if(inp[i].checked) {                   
                                                mas.push(inp[i].value)
                                                titles_mas.push(inp[i].name)
                                            }
                                        }
                                        setString(titles_mas.join('/'))
                                        setCategory(mas)
                }}/>
            <label htmlFor={index}>{title.title}</label>
        </li>)
    })}
  </ul>
</div>
                <div className='flex gap-8 items-center justify-center mt-4'>
                <button
                    onClick={submitHandler}
                    className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'
                >
                    Update
                </button>

                <button
                    onClick={clearFormHandler}
                    className='flex justify-center items-center bg-red-500 text-xs text-white rounded-sm py-2 px-4'
                >
                    Cansel
                </button>
            </div>
        </form>
    )
}
