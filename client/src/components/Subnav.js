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
                    <div style={{ borderRadius: '4px' }} className={determineClass(props.currentPage, link.to)}>
                        <Link className="px-2" to={link.to}>{link.text}</Link>
                    </div>
                )
            })}
        </div>
    )
}

export default Subnav