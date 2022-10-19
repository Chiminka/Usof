import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../redux/features/post/postSlice'
import { getAllCategories } from '../redux/features/post/postSlice'
import '../../src/add_post.css';

export const AddPostPage = () => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [addCategories, setCategory] = useState([])
    const [categoriesTitle, setString] = useState([])
    const [image, setImage] = useState('')
    const {categories} = useSelector((state) => state.post)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const submitHandler = () => {
        try {
            // const category = JSON.stringify(addCategories)
            // let categories2 = JSON.parse(category);
            let formData = new FormData()
            formData.append('title', title)
            formData.append('text', text)
            for (let i = 0; i<addCategories.length; i++){
                formData.append('categories', addCategories[i])
            }
            formData.append('image', image) 
            // for(var pair of formData.entries()){
            //     console.log("hello", pair[0]+', '+pair[1])
            // }
            dispatch(createPost(formData))
            navigate('/')
        } catch (error) {
            console.log(error)
        }
    }
    const clearFormHandler = () => {
        setText('')
        setTitle('')
        setCategory('')
    }

    useEffect(() => {
        dispatch(getAllCategories())
    }, [dispatch])

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
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </label>
            <div className='flex object-cover py-2'>
                {image && (
                    <img src={URL.createObjectURL(image)} alt={image.name} />
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
                Text of the post:
                <textarea
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                    placeholder='Text'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none resize-none h-40 placeholder:text-gray-700'
                />
            </label> 
            <div><span className="text-xs text-white opacity-70">{categoriesTitle}</span> </div>  
            <label className='text-xs text-white opacity-70'>Choose categories:</label>
            <div class="container">
  <ul class="ks-cboxtags">
    {categories.map((title, index) => {  
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
            <label for={index}>{title.title}</label>
        </li>)
    })}
  </ul>
</div>
            {/* {categories.map((title, index) => {  
                return (
                    <li className='ks-cboxtags' key={index} >
                        <div className="text-xs text-white opacity-70">
                            <div className="left-section">
                                <input
                                    className='category'
                                    type="checkbox"
                                    value={title._id}
                                    name={title.title}
                                    onChange= {function () {
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
                                    }}
                                />
                                <label className='categories' htmlFor={`custom-checkbox-${index}`}>{title.title}</label>
                            </div>
                        </div>
                    </li>
                )       
            })} */}
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
                    Cancel
                </button>
            </div>
        </form>
    )
}
