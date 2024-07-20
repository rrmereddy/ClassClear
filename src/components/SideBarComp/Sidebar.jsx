import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { sidebar_data } from './SidebarData';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className={`bg-[#0e0e0e] min-h-screen ${open ? 'w-72' : 'w-[68px]'} duration-500 text-primary_color border-r border-secondary_color px-4`}>
      <div className="py-3 flex justify-end pr-1">
        <FontAwesomeIcon icon={faBars} className="text-3xl cursor-pointer hover:text-secondary_color" onClick={() =>setOpen(!open)} />
      </div>
      <div>
        <ul className='mt-4 flex flex-col gap-4 relative'>
          {sidebar_data.map((item, index) => {
            return (
              <li key={index} className="py-3">
                <Link to={item.link} className="group flex items-center text-lg rounded-lg p-2 gap-3.5 hover:border hover:border-secondary_color">
                  <FontAwesomeIcon icon={item.icon} className="items-center" />
                  <h2 style={{ transitionDelay: `${index * 100}ms` }}
                  className={`whitespace-pre duration-500 ${!open && 'opacity-0 translate-x-28 overflow-hidden'}`}>{item.name}</h2>

                  {/* On hover when the menu is closed */}
                  <h2 className={`${open && 'hidden'} absolute left-48 bg-black font-semibold whitespace-pre text-secondary_color rounded-md drop-shadow-lg w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-16 group-hover:duration-300 group-hover:w-fit`}>
                    {item.name}
                  </h2>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar