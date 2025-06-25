import { Menu, X } from 'lucide-react';
import { sidebar_data } from './SidebarData';
import { Link, useLocation } from 'react-router-dom';
import { useSidebar } from './SidebarContext';
import React, { useState, useEffect, useRef } from 'react';
import SettingOption from './SettingOption';

const Sidebar = () => {
  const { open, setOpen } = useSidebar();
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const tooltipRefs = useRef([]);

  useEffect(() => {
    // Ensure the array length matches the sidebar data length
    tooltipRefs.current = tooltipRefs.current.slice(0, sidebar_data.length);
  }, []);

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <div className={`bg-gradient-to-tr from-[#0e0e0e] to-[#1a1a1a] min-h-screen max-w-[220px] ${open ? 'w-72' : 'w-[73px]'} duration-500 text-primary_color border-r border-secondary_color px-4`}>
      <div className="py-3 flex justify-end">
        {open ? (
          <X size={36} className="text-3xl0 cursor-pointer hover:text-secondary_color" onClick={() => setOpen(false)} />
        ) : (
          <Menu size={36} className="text-3xl0 cursor-pointer hover:text-secondary_color" onClick={() => setOpen(true)} />
        )}
      </div>
      <div className='max-w-[220px]'>
        <ul className='mt-4 flex flex-col gap-4 relative'>
          {sidebar_data.map((item, index) => {
            const handleMouseEnter = () => setHoverIndex(index);
            const handleMouseLeave = () => setHoverIndex(null);

            return (
              <li key={index} className={`flex items-center ${location.pathname === item.link && open ? 'bg-secondary_color rounded-lg' : ''}`}>
                {item.link ? (
                  <Link 
                    to={item.link} 
                    className={`group flex items-center text-lg rounded-lg p-2 gap-3.5 hover:text-secondary_color ${location.pathname === item.link && open ? 'text-primary_color hover:text-primary_color' : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={el => tooltipRefs.current[index] = el}
                  >
                    <div className="flex items-center justify-center">
                      {React.createElement(item.icon, { className: `${location.pathname === item.link && !open ? 'text-secondary_color' : ''}` })}
                      {!open && hoverIndex === index && (
                        <div className="absolute left-14 ml-3 bg-black font-semibold whitespace-pre text-secondary_color rounded-md drop-shadow-lg w-fit px-2 py-1 border border-secondary_color z-10">
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
                ) : (
                  <div 
                    onClick={item.action === 'settings' ? handleSettingsClick : null}
                    className={`group flex items-center text-lg rounded-lg p-2 gap-3.5 hover:text-secondary_color cursor-pointer ${showSettings && open ? 'bg-secondary_color rounded-lg' : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={el => tooltipRefs.current[index] = el}
                  >
                    <div className="flex items-center justify-center">
                      {React.createElement(item.icon, { className: `${showSettings && !open ? 'text-secondary_color' : ''}` })}
                      {!open && hoverIndex === index && (
                        <div className="absolute left-14 ml-3 bg-black font-semibold whitespace-pre text-secondary_color rounded-md drop-shadow-lg w-fit px-2 py-1 border border-secondary_color z-10">
                          {item.name}
                          <div className="absolute bg-black w-3 h-3 top-[12px] -left-1.5 rotate-45 border border-secondary_color border-r-transparent border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                    <h2 style={{ transitionDelay: `${index * 100}ms` }}
                      className={`whitespace-pre duration-500 ${!open && 'opacity-0 translate-x-28 overflow-hidden'}`}>
                      {item.name}
                    </h2>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <SettingOption open={showSettings} onClose={handleCloseSettings} />
    </div>
  );
}

export default Sidebar;
