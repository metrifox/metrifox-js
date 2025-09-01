import React from 'react';

const SideNavigation = ({ navigationItems, activeView, onViewChange }) => {
    return (
        <aside className="side-navigation">
            <div className="nav-header">
                <h3>Navigation</h3>
            </div>
            <nav className="nav-menu">
                {navigationItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onViewChange(item.id)}
                    >
                        <span className="nav-item-label">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default SideNavigation;