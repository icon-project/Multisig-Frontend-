import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SideNavRoutes {
  name: string;
  title: string;
  route: string;
}

interface SideNavProps {
  links: SideNavRoutes[];
}

const SideNav: React.FC<SideNavProps> = ({ links }) => {
  const location = useLocation();
  console.log('links', links);

  return (
    <div className="hidden md:block w-1/5 bg-gray-100 p-4 border-r border-gray-300">
      <nav className="flex flex-col space-y-4">
        {links.map((linkItem) => (
          <Link
            to={linkItem.route}
            className={`text-left font-semibold py-2 px-4 rounded ${location.pathname.includes(linkItem.name) ? 'bg-white bg-opacity-90 shadow' : 'hover:bg-gray-200'}`}
          >
            {linkItem.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideNav;
