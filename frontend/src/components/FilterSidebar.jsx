import React from 'react';

const fieldSurface = 'bg-light-100 hover:bg-white focus:bg-white';

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

            <div className="flex flex-col">
                <div className="border-b border-line pb-5">
                    <label className="pd-label">Ciudad</label>
                    <select
                        name="city"
                        aria-label="Filtrar por ciudad"
                        value={filters.city || ''}
                        onChange={handleChange}
                        disabled={citiesLoading}
                        className={`pd-select ${fieldSurface} disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                        <option value="">
                            {citiesLoading ? 'Cargando ciudades…' : 'Todas las ciudades'}
                        </option>
                        {cities.map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="border-b border-line py-5">
                    <label className="pd-label">Categoría / sector</label>
                    <select
                        name="sector"
                        aria-label="Filtrar por categoría o industria"
                        value={filters.sector || ''}
                        onChange={handleChange}
                        className={`pd-select ${fieldSurface}`}
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

                <div className="border-b border-line py-5">
                    <label className="pd-label">Rango de precio (USD)</label>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice || ''}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Mín."
                            className={`pd-input min-w-0 ${fieldSurface}`}
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
                            className={`pd-input min-w-0 ${fieldSurface}`}
                        />
                    </div>
                </div>

                <div className="pt-6">
                    <button type="button" onClick={handleApply} className="pd-btn-primary w-full py-3 text-base font-semibold">
                        Aplicar filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
