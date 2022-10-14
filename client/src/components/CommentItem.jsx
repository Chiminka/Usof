import React from 'react'
import { AiTwotoneEdit, AiFillDelete} from 'react-icons/ai'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import { removeComment } from '../redux/features/comment/commentSlice'

export const CommentItem = ({ cmt }) => {
    const avatar = cmt.comment.trim().toUpperCase().split('').slice(0, 2)

    const dispatch = useDispatch()
    const params = useParams()

    const removeCommentHandler = () => {
        try {
            dispatch(removeComment(params.id))
            toast('Comment was deleted')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='flex items-center gap-3'>
            <div className='flex items-center justify-center shrink-0 rounded-full w-10 h-10 bg-blue-300 text-sm'>
                {avatar}
            </div>

            <div className='flex text-gray-300 text-[10px]'>{cmt.comment}</div>
            <div className='flex gap-3 mt-4'>
               
                <button className='flex items-center justify-center gap-2 text-white opacity-50'>
                        <AiTwotoneEdit />
                </button>
                <button
                    onClick={removeCommentHandler}
                    className='flex items-center justify-center gap-2  text-white opacity-50'
                >
                    <AiFillDelete />
                </button>
            </div>
        </div>
    )
}
