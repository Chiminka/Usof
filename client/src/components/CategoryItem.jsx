import React from 'react'
// import { AiTwotoneEdit, AiFillDelete} from 'react-icons/ai'
// import { useParams } from 'react-router-dom'
// import { useDispatch } from 'react-redux'
// import { toast } from 'react-toastify'

// import { removeComment } from '../redux/features/comment/commentSlice'

export const CategoryItem = ({ category }) => {

    // const dispatch = useDispatch()
    // const params = useParams()

    // const removeCommentHandler = () => {
    //     try {
    //         dispatch(removeComment(params.id))
    //         toast('Comment was deleted')
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    return (
        <div className='flex items-center gap-3'>
            <div className='flex text-gray-300 text-[10px]'>{category.title}</div>
        </div>
    )
}
