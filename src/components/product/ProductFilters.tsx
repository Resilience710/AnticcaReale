import { Search, SlidersHorizontal, X } from 'lucide-react';
import { FilterState, CATEGORIES, ERAS, Shop } from '../../types';
import { TR } from '../../constants/tr';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  shops: Shop[];
  showMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  shops,
  showMobile = false,
  onCloseMobile,
}: ProductFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFilterChange({
      sortBy: 'newest',
    });
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.category ||
    filters.era ||
    filters.shopId ||
    filters.minPrice ||
    filters.maxPrice
  );

  const categoryOptions = [
    { value: '', label: TR.filters.allCategories },
    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
  ];

  const eraOptions = [
    { value: '', label: TR.filters.allEras },
    ...ERAS.map((era) => ({ value: era, label: era })),
  ];

  const shopOptions = [
    { value: '', label: TR.filters.allShops },
    ...shops.map((shop) => ({ value: shop.id, label: shop.name })),
  ];

  const sortOptions = [
    { value: 'newest', label: TR.filters.sortNewest },
    { value: 'price-asc', label: TR.filters.sortPriceAsc },
    { value: 'price-desc', label: TR.filters.sortPriceDesc },
  ];

  const filterContent = (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-espresso-400" />
        <input
          type="text"
          placeholder={TR.filters.search}
          value={filters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-mist-300 focus:border-gold-500 focus:ring-2 focus:ring-gold-200 bg-linen-100"
        />
      </div>

      {/* Category */}
      <Select
        label={TR.filters.category}
        options={categoryOptions}
        value={filters.category || ''}
        onChange={(e) => updateFilter('category', e.target.value)}
      />

      {/* Era */}
      <Select
        label={TR.filters.era}
        options={eraOptions}
        value={filters.era || ''}
        onChange={(e) => updateFilter('era', e.target.value)}
      />

      {/* Shop */}
      <Select
        label={TR.filters.shop}
        options={shopOptions}
        value={filters.shopId || ''}
        onChange={(e) => updateFilter('shopId', e.target.value)}
      />

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-espresso-800">
          {TR.filters.priceRange}
        </label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder={TR.filters.minPrice}
            value={filters.minPrice || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            type="number"
            placeholder={TR.filters.maxPrice}
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Sort */}
      <Select
        label={TR.filters.sortBy}
        options={sortOptions}
        value={filters.sortBy}
        onChange={(e) => updateFilter('sortBy', e.target.value as FilterState['sortBy'])}
      />

      {/* Clear button */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          {TR.filters.clear}
        </Button>
      )}
    </>
  );

  // Mobile overlay
  if (showMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-linen-300 shadow-xl overflow-y-auto">
          <div className="sticky top-0 bg-linen-200 border-b border-mist-300 p-4 flex items-center justify-between">
            <h2 className="font-semibold text-espresso-900 flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              {TR.filters.title}
            </h2>
            <button onClick={onCloseMobile} className="text-espresso-600 hover:text-espresso-900">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {filterContent}
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div className="bg-linen-200 rounded-xl shadow-sm border border-mist-300 p-6 space-y-6">
      <h2 className="font-semibold text-espresso-900 flex items-center">
        <SlidersHorizontal className="h-5 w-5 mr-2" />
        {TR.filters.title}
      </h2>
      {filterContent}
    </div>
  );
}
