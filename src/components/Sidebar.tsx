"use client";

import { useState } from "react";
import { LayoutDashboard, Clapperboard, BarChart, Lightbulb, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-gray-900 text-white ${isOpen ? "w-64" : "w-20"} p-4 transition-all duration-300 ease-in-out flex flex-col`}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className={`text-2xl font-bold ${isOpen ? '' : 'hidden'}`}>AI Studio</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <ChevronsLeft /> : <ChevronsRight />}
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <LayoutDashboard />
              <span className={`${isOpen ? "ml-2" : "hidden"}`}>Dashboard</span>
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <Clapperboard />
              <span className={`${isOpen ? "ml-2" : "hidden"}`}>Videos</span>
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <BarChart />
              <span className={`${isOpen ? "ml-2" : "hidden"}`}>Analytics</span>
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-700">
              <Lightbulb />
              <span className={`${isOpen ? "ml-2" : "hidden"}`}>Content Ideas</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
