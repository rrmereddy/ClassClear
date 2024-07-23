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
  }, [sidebar_data.length]);

  return (
    <div className={`bg-[#0e0e0e] min-h-screen ${open ? 'w-72' : 'w-[68px]'} duration-500 text-primary_color border-r border-secondary_color px-4`}>
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
                  <FontAwesomeIcon icon={item.icon} className="items-center" />
                  <h2 style={{ transitionDelay: `${index * 100}ms` }}
                    className={`whitespace-pre duration-500 ${!open && 'opacity-0 translate-x-28 overflow-hidden'}`}>
                    {item.name}
                  </h2>

                  {/* On hover when the menu is closed */}
                  <div 
                    className={`${open && 'hidden'} ${hoverIndex === index ? 'opacity-100' : 'opacity-0'} absolute left-80 bg-black font-semibold whitespace-pre text-secondary_color rounded-md drop-shadow-lg w-fit overflow-visible px-2 py-1 duration-300 border border-secondary_color`}
                    style={{ left: `${tooltipRefs.current[index]?.offsetWidth / 0.5}px` }}
                  >
                    <div 
                      className="absolute bg-black size-3 top-[12px] rotate-45 border border-l-secondary_color border-b-secondary_color border-r-transparent border-t-transparent"
                      style={{ left: `${tooltipRefs.current[index]?.offsetWidth / 5 - 14}px` }} 
                    ></div>
                    {item.name}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
