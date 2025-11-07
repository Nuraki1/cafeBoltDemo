import { Plus } from 'lucide-react';
import { MenuItem } from '../../types/cashier';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
  selectedCategory?: string;
}

export default function MenuGrid({ items, onAddToCart, selectedCategory }: MenuGridProps) {
  const categories = Array.from(new Set(items.map(item => item.category)));
  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => window.location.href = window.location.href}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white rounded-lg font-medium whitespace-nowrap hover:shadow-lg transition-all"
        >
          All Items
        </button>
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-yellow-400 text-gray-800'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-red-100 to-yellow-100 flex items-center justify-center">
                <span className="text-4xl">🍽️</span>
              </div>
            )}
            <div className="p-3">
              <h3 className="font-bold text-gray-800 text-sm line-clamp-2">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-2 line-clamp-1">{item.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-red-600">
                  ${item.price.toFixed(2)}
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {item.preparation_time}m
                </span>
              </div>
              <button
                onClick={() => onAddToCart(item, 1)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-yellow-500 text-white py-2 rounded-lg hover:shadow-md transition-all font-semibold text-sm"
              >
                <Plus size={16} />
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No items available</p>
        </div>
      )}
    </div>
  );
}
