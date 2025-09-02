import React from 'react';

const InlineTabNavigation = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="inline-tab-navigation">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`inline-tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default InlineTabNavigation;