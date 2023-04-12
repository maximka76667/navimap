import React, { useContext, useEffect, useState } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import DrinksContext from '../../contexts/DrinksContext';
// import Search from '../Search/Search';
import './Sidebar.sass';
import { IRoute } from '../../interfaces';

const Sidebar = ({ isOpened, onListItemClick }: any) => {
    // const drinks = useContext(DrinksContext);
    // const [search, setSearch] = useState('');
    const [routes, setRoutes] = useState<IRoute[]>([]);

    // const navigate = useNavigate();

    // function handleSearch(search: string) {
    //     setSearch(search);
    // }

    useEffect(() => {

    }, [])

    return (
        <div
            className={`sidebar-wrapper ${isOpened ? 'sidebar-wrapper_opened' : ''}`}
        >
            <aside className='sidebar'>
                {/* <Search search={search} onSearch={handleSearch} /> */}
                <ul className='sidebar__list'>
                    {routes.length !== 0 ? (
                        routes.map((route) => (
                            <li key={route.name} className='sidebar__item'>
                                <button onClick={onListItemClick}>
                                    {route.name}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className='sidebar__item'>
                            <p className='sidebar__not-found'>Nothing is found</p>
                        </li>
                    )}
                </ul>
            </aside>
        </div>
    );
};

export default Sidebar;