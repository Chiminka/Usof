import React from 'react'


export const CategoryItem = ({ category }) => {

    return (
        <div className='flex items-center gap-3'>
            <div className='flex text-gray-300 text-[10px]'>#{category.title}</div>
        </div>
    )
}
