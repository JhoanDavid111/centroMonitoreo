// src/components/DataGrid/DataGrid.jsx
import { useDataGrid } from './hooks/useDataGrid';
import DataGridTabs from './DataGridTabs';
import DataGridTable from './DataGridTable';
import DataGridChart from './DataGridChart';

const DataGrid = ({ config }) => {
    const {
        activeTab,
        filteredData,
        loading,
        error,
        chartOptions,
        filters,
        setFilters,
        globalFilter,
        setGlobalFilter,
        handleTabChange,
        handleViewChart,
        exportToCSV
    } = useDataGrid(config);

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">{config.title}</h2>

            <DataGridTabs
                tabs={config.tabs}
                activeTab={activeTab}
                onChange={handleTabChange}
            />

            {config.tabs[activeTab]?.table && (
                <DataGridTable
                    columns={config.tabs[activeTab].columns}
                    data={filteredData}
                    loading={loading}
                    error={error}
                    onExport={exportToCSV}
                    onViewChart={config.tabs[activeTab].chart ? handleViewChart : null}
                    filters={filters}
                    setFilters={setFilters}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            )}

            {config.tabs[activeTab]?.chart && chartOptions && (
                <DataGridChart
                    options={chartOptions}
                    loading={loading}
                    error={error}
                />
            )}

            {config.tabs[activeTab]?.customComponent && (
                config.tabs[activeTab].customComponent
            )}
        </section>
    );
};

export default DataGrid;