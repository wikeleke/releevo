import React from 'react';

const inputClass =
    'w-full rounded-lg border border-[#D7DEEA] bg-white px-3.5 py-2.5 text-sm text-oxford shadow-none transition-colors duration-150 placeholder:text-[#98A2B3] hover:border-[#C7D1E0] focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-900/10';

const selectClass =
    'w-full cursor-pointer appearance-none rounded-lg border border-[#D7DEEA] bg-white bg-[length:14px] bg-[right_10px_center] bg-no-repeat px-3.5 py-2.5 pr-9 text-sm text-oxford shadow-none transition-colors duration-150 hover:border-[#C7D1E0] focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-900/10 disabled:cursor-not-allowed disabled:opacity-60';

const applyButtonClass =
    'w-full rounded-lg bg-brand-900 px-7 py-3 text-center text-sm font-semibold text-white shadow-pd transition-colors hover:bg-brand-700 sm:text-base';

const FilterSidebar = ({ filters, setFilters, applyFilters, cities = [], citiesLoading = false }) => {
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
        <div className="sticky top-24 rounded-xl border border-line bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-oxford">Filtros</h3>

            <div className="space-y-6">
                <div>
                    <label className="pd-label">Ciudad</label>
                    <select
                        name="city"
                        aria-label="Filtrar por ciudad"
                        value={filters.city || ''}
                        onChange={handleChange}
                        disabled={citiesLoading}
                        className={selectClass}
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%2371727A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                        }}
                    >
                        <option value="">{citiesLoading ? 'Cargando ciudades...' : 'Ej. Ciudad de Mexico'}</option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="pd-label">Categoría / sector</label>
                    <select
                        name="sector"
                        aria-label="Filtrar por categoría o industria"
                        value={filters.sector || ''}
                        onChange={handleChange}
                        className={selectClass}
                        style={{
                            backgroundImage:
                                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' viewBox='0 0 24 24' stroke='%2371727A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                        }}
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
                    <label className="pd-label">Rango de precio (USD)</label>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice || ''}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Mín."
                            className={`${inputClass} min-w-0`}
                        />
                        <span className="shrink-0 px-0.5 text-center text-sm font-medium text-dark-400" aria-hidden>
                            —
                        </span>
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice || ''}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Máx."
                            className={`${inputClass} min-w-0`}
                        />
                    </div>
                </div>

                <div className="pt-1">
                    <button type="button" onClick={handleApply} className={applyButtonClass}>
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
