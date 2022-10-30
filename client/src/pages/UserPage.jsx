import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { PostItem} from '../components/PostItem'
import axios from '../utils/axios'
import {Pagination} from '../components/Pagination'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Moment from 'react-moment'
import {
    AiTwotoneEdit,
    AiFillDelete
} from 'react-icons/ai'
import Modal from '../components/Modal'
import { toast } from 'react-toastify'
import { updateUser, removeUser } from '../redux/features/user/userSlice'

export const UserPage = () => {
    const [posts, setPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(5)
    const [ users, setUser ] = useState([])
    const {user} = useSelector((state) => state.auth)
    const [modalActive, setModalActive] = useState(false)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [full_name, setFull_name] = useState('')
    const [password, setPassword] = useState('')
    const [re_password, setRePassword] = useState('')
    const [oldImage, setOldImage] = useState('')
    const [newImage, setNewImage] = useState('')
    const [role, setRole] = useState('')
    const [verified, setVerified] = useState('')

    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

     const submitHandler = () => {
        try {
           let formData = new FormData()
           formData.append('id', params.id)
            formData.append('email', email)
            formData.append('username', username)
            formData.append('full_name', full_name)
            formData.append('avatar', newImage) 
            formData.append('role', role)
            formData.append('verified', verified) 
            if (password === re_password && password !== '****') {
                formData.append('password', password)
                dispatch(updateUser(formData))
                toast('User updated')
                navigate('/users_all')
            } else if (password === '****') {
                dispatch(updateUser(formData))
                toast('User updated')
                navigate('/users_all')
            }
            else toast('Passwords can not be different')
        } catch (error) {
            console.log(error)
        }
    }

     const removeUserHandler = () => {
        try {
            const id = params.id
            dispatch(removeUser(id))
            toast('User deleted')
            navigate('/users_all')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMyPosts = async () => {
        try {
            const { data } = await axios.get(`/users/${params.id}/posts`)
            setPosts(data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`/users/${params.id}`)
            setUser(data)
            setEmail(data.email)
            setPassword('****')
            setRePassword('****')
            setUsername(data.username)
            setFull_name(data.full_name)
            setOldImage(data.avatar)
            setRole(data.role)
            setVerified(data.verified)
        } catch (error) {
            console.log(error)
        }
    }

    const clearFormHandler = () => {
        setPassword('')
        setEmail('')
        setUsername('')
        setRePassword('')     
        setRole('')
        setVerified('')
        navigate('/users_all')
    }

        if(!window.location.hash){
            window.location=window.location+'#loaded'
            window.location.reload()
        }     
  

    useEffect(() => {
        fetchMyPosts()
    }, [])

    useEffect(() => {
        fetchUser()
    }, [])

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts ? posts.slice(indexOfFirstPost, indexOfLastPost) : posts

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const rights =()=>{
        for (let i = 0; i<posts.length; i++) {
            if(posts[i].status === 'active' || user?.role === 'admin' || posts[i].author === user?._id)
                return (
                    currentPosts?.map((post, idx) => (
                        <PostItem post={post} key={idx} />
                    ))
                )
        }
    }

    const admin_rights = () => {
        if (user.role === 'admin') {
            return (
                <div>
                    <label className='text-xs text-white opacity-70'>
                Role:
                <input
                    type='text'
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder='admin / user (default)'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
             <label className='text-xs text-white opacity-70'>
                Verified:
                <input
                    type='text'
                    value={verified}
                    onChange={(e) => setVerified(e.target.value)}
                    placeholder='true / false'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
                </div>
            )
        }
    }

    const edit_delete = ()=>{
        if(!user) 
            <div>Loading...</div>
        else if (user.role === 'admin' || user?._id === users?._id) {
            return(
                <div className='flex gap-3 mt-4'>
                    <button className='flex items-center justify-center gap-2 text-white opacity-50'>
                        <button onClick={()=>setModalActive(true)}>
                            <AiTwotoneEdit />
                        </button>
                    </button>
                    <button
                        onClick={removeUserHandler}
                        className='flex items-center justify-center gap-2  text-white opacity-50'
                    >
                        <AiFillDelete />
                    </button>
                    <Modal active={modalActive} setActive={setModalActive}>
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
                *Username:
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                *Email:
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='michel@gmail.com'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                *Password:
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='New password'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                *Repeat password:
                <input
                    type='password'
                    value={re_password}
                    onChange={(e) => setRePassword(e.target.value)}
                    placeholder='Password'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            <label className='text-xs text-white opacity-70'>
                Full name:
                <input
                    type='text'
                    value={full_name}
                    onChange={(e) => setFull_name(e.target.value)}
                    placeholder='Michel Jobs'
                    className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none placeholder:text-gray-700'
                />
            </label>
            {admin_rights()}
            <div className='flex gap-8 items-center justify-center mt-4'>
                <button
                    onClick={submitHandler}
                    className='flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4'
                >
                    Edit
                </button>

                <button
                    onClick={clearFormHandler}
                    className='flex justify-center items-center bg-red-500 text-xs text-white rounded-sm py-2 px-4'
                >
                    Cancel
                </button>
            </div>
                    </Modal>
                </div>
            )
        }
    }

    
    return (
        <div className='w-1/2 mx-auto py-10 flex flex-col gap-10'>
          <div className='flex flex-col basis-1/4 flex-grow mt-10'>
                 <div className='flex flex-col basis-1/4 flex-grow'>
                        <div
                            className={
                                users?.avatar
                                    ? 'flex rounded-sm h-32 w-32'
                                    : 'flex rounded-sm h-32 w-32'
                            }
                        >
                            {users?.avatar ? (
                                <img
                                    src={`http://localhost:3002/${users.avatar}`}
                                    alt='img'
                                    className='object-cover w-full'
                                />
                            ) : (
                                <img
                                    src={`data:image/jpeg;base64,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`}
                                    alt='img'
                                    className='object-cover w-full'
                                />
                            )}
                        </div>
                        {edit_delete()}
                    </div>
                    <div className='border-2 border-slate-600 border-r-4 rounded p-4 mt-3'>
                        <div className='flex justify-between items-center pt-2 text-sm text-white opacity-19'>
                    <div className='text-xs text-white opacity-50'>
                        {users.username}
                    </div>
                    <div className='text-xs text-white opacity-50'>
                        Member from: <Moment date={users.createdAt} format='D MMM YYYY' />
                    </div>
                </div>
                <div className='flex justify-between items-center pt-2 text-sm text-white opacity-19'>
                    <div className='text-white opacity-60 text-xs pt-2 line-clamp-4'>
                        {users.full_name}
                    </div>
                    <div className='text-white opacity-60 text-xs line-clamp-4'>
                        {users.role}
                    </div>
                </div>
                <div className='flex gap-3 items-center mt-2'>
                    <div className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                        Reputation:{' '}
                        <span>{users.rating || 0} </span>
                    </div>
                    <div className='flex items-center justify-center gap-2 text-xs text-white opacity-50'>
                        Posts:{' '}
                        <span>{posts.length || 0} </span>
                    </div>
                </div>
                <div className='text-xs text-white opacity-50'>
                </div>
 
                    </div>
                </div>
            <p className='text-xl text-white opacity-50'>Posts:</p>
            {rights()}
            <div className='max-w-[900px] mx-auto py-10'>
                <Pagination postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate}/>
            </div>
        </div>
    )
}