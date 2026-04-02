import React from 'react';

const FilterSidebar = ({ filters, setFilters, applyFilters }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApply = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="text-xl font-extrabold text-oxford mb-5 tracking-tight">Filtros</h3>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Ciudad</label>
                    <input
                        type="text"
                        name="city"
                        value={filters.city || ''}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ej. Ciudad de Mexico"
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-marine focus:bg-white text-sm transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Sector</label>
                    <select
                        name="sector"
                        value={filters.sector || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-marine focus:bg-white text-sm transition-all appearance-none cursor-pointer"
                    >
                        <option value="">Todos los sectores</option>
                        <option value="Retail">Comercio minorista</option>
                        <option value="Food & Beverage">Alimentos y bebidas</option>
                        <option value="Technology">Tecnologia</option>
                        <option value="Services">Servicios</option>
                        <option value="Manufacturing">Manufactura</option>
                        <option value="Healthcare">Salud</option>
                        <option value="Real Estate">Bienes raices</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Rango de precio (USD)</label>
                    <div className="flex items-center space-x-3">
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice || ''}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Min"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-marine focus:bg-white text-sm transition-all"
                        />
                        <span className="text-gray-400 font-medium">-</span>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice || ''}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Max"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-marine focus:bg-white text-sm transition-all"
                        />
                    </div>
                </div>

                <button
                    onClick={handleApply}
                    className="w-full bg-marine text-white mt-8 py-3 rounded-lg font-bold hover:bg-blue-900 focus:ring-2 focus:ring-offset-2 focus:ring-marine transition-all shadow-sm"
                >
                    Aplicar filtros
                </button>
            </div>
        </div>
    );
};

export default FilterSidebar;
