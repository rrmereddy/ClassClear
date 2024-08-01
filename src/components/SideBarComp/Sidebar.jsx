import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { sidebar_data } from './SidebarData';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import { useState, useEffect, useRef } from 'react';

const Sidebar = () => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState(null);
  const tooltipRefs = useRef([]);

  useEffect(() => {
    // Ensure the array length matches the sidebar data length
    tooltipRefs.current = tooltipRefs.current.slice(0, sidebar_data.length);
  }, []);

  return (
    <div className={`bg-gradient-to-tr from-[#0e0e0e] to-[#1a1a1a] min-h-screen ${open ? 'w-72' : 'w-[68px]'} duration-500 text-primary_color border-r border-secondary_color px-4`}>
      <div className="py-3 flex justify-end pr-1">
        <FontAwesomeIcon icon={faBars} className="text-3xl cursor-pointer hover:text-secondary_color" onClick={() => setOpen(!open)} />
      </div>
      <div>
        <ul className='mt-4 flex flex-col gap-4 relative'>
          {sidebar_data.map((item, index) => {
            const handleMouseEnter = () => setHoverIndex(index);
            const handleMouseLeave = () => setHoverIndex(null);

            return (
              <li key={index} className={`${location.pathname === item.link ? 'bg-secondary_color rounded-lg' : ''}`}>
                <Link 
                  to={item.link} 
                  className="group flex items-center text-lg rounded-lg p-2 gap-3.5 hover:border hover:border-secondary_color"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  ref={el => tooltipRefs.current[index] = el}
                >
                  <div className="relative flex items-center">
                    <FontAwesomeIcon icon={item.icon} className="items-center" />
                    {!open && hoverIndex === index && (
                      <div className="absolute left-12 ml-3 bg-black font-semibold whitespace-pre text-secondary_color rounded-md drop-shadow-lg w-fit px-2 py-1 border border-secondary_color z-10">
                        {item.name}
                        <div className="absolute bg-black w-3 h-3 top-[12px] -left-1.5 rotate-45 border border-secondary_color border-r-transparent border-t-transparent"></div>
                      </div>
                    )}
                  </div>
                  <h2 style={{ transitionDelay: `${index * 100}ms` }}
                    className={`whitespace-pre duration-500 ${!open && 'opacity-0 translate-x-28 overflow-hidden'}`}>
                    {item.name}
                  </h2>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
