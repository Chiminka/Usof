import React from 'react'
import { Navbar } from './Navbar'
import {LeftBar} from './LeftBar'

export const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <div className='flex'>
            <div className='container mx-auto'>
                <Navbar />
                {children}
            </div>
            </div>
        </React.Fragment>
    )
}
