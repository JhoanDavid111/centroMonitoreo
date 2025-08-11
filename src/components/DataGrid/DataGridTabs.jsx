//. src/components/DataGrid/DataGridTabs.jsx

const DataGridTabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex space-x-4 border-b border-gray-700 mb-4">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => onChange(index)}
          className={`pb-2 font-medium ${
            activeTab === index
              ? 'border-b-2 border-yellow-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DataGridTabs;