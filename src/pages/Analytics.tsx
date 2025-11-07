import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export default function Analytics() {
  const { stats, orders, products, loading } = useDashboard();

  const totalRevenue = stats.totalRevenue;
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  const recentTrends = [
    { metric: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, change: '+15%', up: true },
    { metric: 'Average Order Value', value: `$${avgOrderValue.toFixed(2)}`, change: '+8%', up: true },
    { metric: 'Low Stock Items', value: lowStockProducts, change: '-5%', up: false },
    { metric: 'Order Completion Rate', value: '94%', change: '+3%', up: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Analytics Overview</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
          <Activity size={20} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentTrends.map((trend, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">{trend.metric}</h4>
              {trend.up ? (
                <TrendingUp className="text-green-600" size={20} />
              ) : (
                <TrendingDown className="text-red-600" size={20} />
              )}
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">{trend.value}</p>
            <span
              className={`text-sm font-semibold ${
                trend.up ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.change} from last month
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Order Status Distribution</h4>
          <div className="space-y-4">
            {['pending', 'processing', 'completed', 'cancelled'].map((status) => {
              const count = orders.filter(o => o.status === status).length;
              const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;

              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'completed'
                          ? 'bg-green-500'
                          : status === 'pending'
                          ? 'bg-yellow-500'
                          : status === 'processing'
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Product Categories</h4>
          <div className="space-y-4">
            {Array.from(new Set(products.map(p => p.category))).map((category) => {
              const count = products.filter(p => p.category === category).length;
              const percentage = products.length > 0 ? (count / products.length) * 100 : 0;

              return (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-red-500 to-yellow-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-800 mb-4">Key Performance Indicators</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Total Customers</p>
            <p className="text-3xl font-bold text-red-600">{stats.totalUsers}</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Active Products</p>
            <p className="text-3xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'active').length}
            </p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Conversion Rate</p>
            <p className="text-3xl font-bold text-red-600">24.5%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
