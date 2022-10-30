import React from 'react'
import { AiTwotoneEdit, AiFillDelete, AiOutlineMinusCircle} from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../components/Modal'
import { removeComment, updateComment } from '../redux/features/comment/commentSlice'
import { useEffect, useState, useCallback } from 'react'
import axios from '../utils/axios'

export const CommentItem = ({ cmt }) => {
    
    const { userID } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.auth)
    const [modalActive, setModalActive] = useState(false)
    const [comment, setComment] = useState('')
    const avatar = cmt.comment.trim().toUpperCase().split('').slice(0, 2)

    const dispatch = useDispatch()

    const fetchComment = useCallback(async () => {
        const { data } = await axios.get(`/comments/${cmt._id}`)
        setComment(data.comment)
    }, [cmt._id])

    useEffect(() => {
        fetchComment()
    }, [fetchComment])

    const removeCommentHandler = () => {
        try {
            if (userID === cmt.author) {
                dispatch(removeComment(cmt._id))
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateCommentHandler = () => {
        try {
            if (userID === cmt.author) {
                let stat = ''
                const id = cmt._id
                dispatch(updateComment({id, comment, stat}))
                window.location.reload()
            } else
            if (user.role === 'admin') {
                let stat = ''
                const id = cmt._id
                if (cmt.status === 'active')
                    stat = 'inactive'
                if (cmt.status === 'inactive')
                    stat = 'active'
                dispatch(updateComment({id, comment, stat}))
                window.location.reload()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const admin = () => {
          if (user?.role === 'admin' && (user._id !== cmt.author)) {
            return(
                    <button className='flex items-center justify-center gap-2 text-white opacity-50 p-4' onClick={updateCommentHandler}>
                        <AiOutlineMinusCircle/>
                    </button>
            )
        }
    }

    const rights = () => {
        if (user._id === cmt.author) {
            return (
                <div className='flex gap-3 mt-4'>
                    <button 
                        onClick={()=>setModalActive(true)}
                        className='flex items-center justify-center gap-2 text-white opacity-50'>
                        <AiTwotoneEdit />
                    </button>
                    <button
                        onClick={removeCommentHandler}
                        className='flex items-center justify-center gap-2  text-white opacity-50'
                    >
                        <AiFillDelete />
                    </button>
                    <Modal active={modalActive} setActive={setModalActive}>
                        <label className='text-xs text-white opacity-70'>
                            <textarea
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                                placeholder='Text'
                                className='mt-1 text-black w-full rounded-lg bg-gray-400 border py-1 px-2 text-xs outline-none resize-none h-40 placeholder:text-gray-700'
                            />
                        </label>
                        <div>
                            <button
                                onClick={updateCommentHandler}
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

    return (
        <div className='flex items-center gap-3 pt-3'>
            <div className='flex items-center justify-center shrink-0 rounded-full w-10 h-10 bg-blue-300 text-sm'>
                {avatar}
            </div>
            <div className='flex justify-between items-center pt-2 w-full'>
                <div className='text-gray-300 text-[10px]'>{cmt.comment}</div> 
                <div className='text-gray-300 text-[10px]'>({cmt.status})</div>
            </div>
            {admin()} 
            {rights()}
        </div>
    )
}
