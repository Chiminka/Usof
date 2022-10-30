import React from 'react'
import { Navbar } from './Navbar'
import {LeftBar} from './LeftBar'

export const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <div>
            <div className='mx-20'>
                <Navbar />
                {children}
            </div>
            </div>
        </React.Fragment>
    )
}
