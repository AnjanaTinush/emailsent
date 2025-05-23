import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const SummarySection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme colors matching your existing UI
  const colors = {
    primary: "#800000", // Dark red from your buttons
    secondary: "#A52A2A", // Lighter red
    processing: "#D2B48C", // Tan color for your processing status
    cancelled: "#E57373", // Light red for cancelled
    refund: "#90CAF9", // Light blue for refund
    delivered: "#81C784", // Green for delivered
    shipped: "#FFB74D", // Orange for shipped
    pending: "#B0BEC5", // Gray for pending
    chartColors: ["#800000", "#A52A2A", "#D2B48C", "#E57373", "#90CAF9", "#81C784", "#FFB74D", "#B0BEC5"]
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/checkout');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        console.log('Fetched Data:', data);
  
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load order data. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  
  // Calculate financial metrics
  const calculateFinancialMetrics = () => {
    if (!orders || orders.length === 0) return {
      totalRevenue: 0,
      processingValue: 0,
      refundValue: 0,
      cancelledValue: 0,
      shippedValue: 0,
      deliveredValue: 0,
      pendingValue: 0,
      avgOrderValue: 0,
      totalOrders: 0
    };

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Filter orders by status
    const processingOrders = orders.filter(order => order.status === "Processing");
    const refundOrders = orders.filter(order => order.status === "Refund");
    const cancelledOrders = orders.filter(order => order.status === "Cancelled");
    const shippedOrders = orders.filter(order => order.status === "Shipped");
    const deliveredOrders = orders.filter(order => order.status === "Delivered");
    const pendingOrders = orders.filter(order => order.status === "Pending");
    
    // Calculate revenue by status
    const processingValue = processingOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const refundValue = refundOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const cancelledValue = cancelledOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const shippedValue = shippedOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const deliveredValue = deliveredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    const pendingValue = pendingOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Calculate net revenue (all non-refunded/cancelled orders)
    const netRevenue = totalRevenue - refundValue - cancelledValue;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalRevenue,
      netRevenue,
      processingValue,
      refundValue,
      cancelledValue,
      shippedValue,
      deliveredValue,
      pendingValue,
      avgOrderValue,
      totalOrders
    };
  };

  // Prepare chart data
  const prepareChartData = () => {
    // Revenue by status for pie chart - include all statuses that have values
    const revenueByStatus = [
      { name: 'Processing', value: orders.filter(order => order.status === 'Processing').reduce((sum, order) => sum + order.totalPrice, 0) },
      { name: 'Refund', value: orders.filter(order => order.status === 'Refund').reduce((sum, order) => sum + order.totalPrice, 0) },
      { name: 'Cancelled', value: orders.filter(order => order.status === 'Cancelled').reduce((sum, order) => sum + order.totalPrice, 0) },
      { name: 'Shipped', value: orders.filter(order => order.status === 'Shipped').reduce((sum, order) => sum + order.totalPrice, 0) },
      { name: 'Delivered', value: orders.filter(order => order.status === 'Delivered').reduce((sum, order) => sum + order.totalPrice, 0) },
      { name: 'Pending', value: orders.filter(order => order.status === 'Pending').reduce((sum, order) => sum + order.totalPrice, 0) }
    ].filter(status => status.value > 0); // Only include statuses with values > 0

    // Daily revenue for line chart
    const salesByDate = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = {
          total: 0,
          processing: 0,
          refund: 0,
          cancelled: 0,
          shipped: 0,
          delivered: 0,
          pending: 0
        };
      }
      
      salesByDate[date].total += order.totalPrice;
      
      if (order.status === "Processing") {
        salesByDate[date].processing += order.totalPrice;
      } else if (order.status === "Refund") {
        salesByDate[date].refund += order.totalPrice;
      } else if (order.status === "Cancelled") {
        salesByDate[date].cancelled += order.totalPrice;
      } else if (order.status === "Shipped") {
        salesByDate[date].shipped += order.totalPrice;
      } else if (order.status === "Delivered") {
        salesByDate[date].delivered += order.totalPrice;
      } else if (order.status === "Pending") {
        salesByDate[date].pending += order.totalPrice;
      }
    });

    const dailyRevenueData = Object.keys(salesByDate).map(date => ({
      date,
      total: salesByDate[date].total,
      processing: salesByDate[date].processing,
      refund: salesByDate[date].refund,
      cancelled: salesByDate[date].cancelled,
      shipped: salesByDate[date].shipped,
      delivered: salesByDate[date].delivered,
      pending: salesByDate[date].pending
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Top products by revenue
    const productRevenue = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.productId._id;
        const productName = item.productId.productName;
        if (!productRevenue[productId]) {
          productRevenue[productId] = {
            name: productName,
            revenue: 0,
            quantity: 0
          };
        }
        productRevenue[productId].revenue += item.price * item.quantity;
        productRevenue[productId].quantity += item.quantity;
      });
    });

    const topProductsByRevenue = Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 products

    // User spending analysis
    const userSpending = {};
    orders.forEach(order => {
      if (!order.userId || !order.userId.username) return;
      
      const username = order.userId.username;
      if (!userSpending[username]) {
        userSpending[username] = 0;
      }
      userSpending[username] += order.totalPrice;
    });

    const topCustomers = Object.keys(userSpending)
      .map(user => ({ name: user, spent: userSpending[user] }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5); // Top 5 customers

    return {
      revenueByStatus,
      dailyRevenueData,
      topProductsByRevenue,
      topCustomers
    };
  };

  const financialMetrics = calculateFinancialMetrics();
  const { revenueByStatus, dailyRevenueData, topProductsByRevenue, topCustomers } = prepareChartData();

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(value);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded shadow-md border border-gray-200">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-gray-700">Loading financial data...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Financial Summary Dashboard</h2>
      
      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-800">
          <h3 className="text-gray-500 text-sm uppercase">Total Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(financialMetrics.totalRevenue)}</p>
          <p className="text-sm text-gray-500">All orders</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-600">
          <h3 className="text-gray-500 text-sm uppercase">Net Revenue</h3>
          <p className="text-2xl font-bold">{formatCurrency(financialMetrics.netRevenue)}</p>
          <p className="text-sm text-gray-500">Excluding refunds & cancellations</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm uppercase">Refunded Amount</h3>
          <p className="text-2xl font-bold">{formatCurrency(financialMetrics.refundValue)}</p>
          <p className="text-sm text-gray-500">Money returned</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-800">
          <h3 className="text-gray-500 text-sm uppercase">Avg. Order Value</h3>
          <p className="text-2xl font-bold">{formatCurrency(financialMetrics.avgOrderValue)}</p>
          <p className="text-sm text-gray-500">Per transaction</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue by Status */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Revenue by Order Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${formatCurrency(value)} (${(percent * 100).toFixed(0)}%)`}
                >
                  {revenueByStatus.map((entry, index) => {
                    let color;
                    if (entry.name === 'Processing') color = colors.processing;
                    else if (entry.name === 'Refund') color = colors.refund;
                    else if (entry.name === 'Cancelled') color = colors.cancelled;
                    else if (entry.name === 'Shipped') color = colors.shipped;
                    else if (entry.name === 'Delivered') color = colors.delivered;
                    else if (entry.name === 'Pending') color = colors.pending;
                    else color = colors.chartColors[index % colors.chartColors.length];
                    
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Daily Revenue Trend */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Daily Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyRevenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="processing"
                  name="Processing"
                  stroke={colors.processing}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="refund"
                  name="Refund"
                  stroke={colors.refund}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  name="Cancelled"
                  stroke={colors.cancelled}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="shipped"
                  name="Shipped"
                  stroke={colors.shipped}
                  strokeWidth={2}
                />
                {dailyRevenueData.some(day => day.delivered > 0) && (
                  <Line
                    type="monotone"
                    dataKey="delivered"
                    name="Delivered"
                    stroke={colors.delivered}
                    strokeWidth={2}
                  />
                )}
                {dailyRevenueData.some(day => day.pending > 0) && (
                  <Line
                    type="monotone"
                    dataKey="pending"
                    name="Pending"
                    stroke={colors.pending}
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Products by Revenue */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Top Products by Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProductsByRevenue}
                margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  height={60} 
                  interval={0} 
                  angle={-45} 
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="revenue" 
                  name="Revenue" 
                  fill={colors.primary} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Customers by Spending */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Top Customers by Spending</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topCustomers}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="spent" 
                  name="Total Spent" 
                  fill={colors.secondary} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Revenue Breakdown Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">Revenue Breakdown</h3>
          <button
            onClick={() => window.location.href = '/viewcheckouts'}
            className="bg-[#660708] text-[#F5F3F4] px-4 py-2 rounded-md hover:bg-[#7A0B0B] focus:outline-none focus:ring-2 focus:ring-[#660708] focus:ring-offset-2 transition-all"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipped</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancelled</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailyRevenueData.map((day, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(day.processing)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(day.shipped)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(day.refund)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(day.cancelled)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(day.pending)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(day.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                  {formatCurrency(financialMetrics.processingValue)}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                  {formatCurrency(financialMetrics.shippedValue)}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                  {formatCurrency(financialMetrics.refundValue)}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                  {formatCurrency(financialMetrics.cancelledValue)}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                  {formatCurrency(financialMetrics.pendingValue)}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                  {formatCurrency(financialMetrics.totalRevenue)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;