import React from 'react'
import { Link } from 'react-router-dom'

const Subnav = (props) => {

    const links = [{ to: '/feed', text: 'Feed' }, { to: '/library', text: 'Library' }]

    const determineClass = (currentPage, to) => {

        if (currentPage === to) {
            return "bg-royalblue text-white text-center text-lg my-1"
        } else if (currentPage === "/" && to === "/feed") {
            return "bg-royalblue text-white text-center text-lg my-1"
        }
        else {
            return "hover:bg-gray-400 text-center text-lg my-1"
        }
    }

    return (
        <div>
            {links.map((link) => {
                return (
                    <Link style={{ borderRadius: '4px', display: 'block' }} className={`px-2 ${determineClass(props.currentPage, link.to)}`} to={link.to}>{link.text}</Link>
                )
            })}
        </div>
    )
}

export default Subnav