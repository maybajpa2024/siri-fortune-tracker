const { useState, useEffect } = React;

// Your existing Google Script URL
const API_URL = 'https://script.google.com/macros/s/AKfycbx31A95P4amBwO3Fb6tSujfz2TK6y2hjHPEZNi7bZEfzzJX9w-w9zb0TIQi6rwES3WB/exec';
const ADMIN_PASSWORD = 'SiriFortune@2025!SecureAdmin';

// Icon components
const Building = () => React.createElement('span', { className: 'text-2xl' }, '🏢');
const Users = () => React.createElement('span', { className: 'text-2xl' }, '👥');
const DollarSign = () => React.createElement('span', { className: 'text-2xl' }, '💰');
const TrendingUp = () => React.createElement('span', { className: 'text-2xl' }, '📈');
const Plus = () => React.createElement('span', { className: 'text-lg' }, '➕');
const Settings = () => React.createElement('span', { className: 'text-lg' }, '⚙️');

const SiriFortuneApp = () => {
  const [activeTab, setActiveTab] = useState('apartments');
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFlat, setSearchFlat] = useState('');

  const [paymentForm, setPaymentForm] = useState({
    flatNumber: '', amount: '', date: '', month: '', year: '',
    description: 'Monthly Maintenance', status: 'Paid'
  });

  const fetchData = async (action = 'getApartments') => {
    try {
      setLoading(true);
      const url = action === 'getApartments' ? API_URL : `${API_URL}?action=${action}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(`${action} data:`, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${action}:`, error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [apartmentsData, paymentsData] = await Promise.all([
        fetchData('getApartments'),
        fetchData('getPayments')
      ]);

      setApartments(Array.isArray(apartmentsData) ? apartmentsData : []);
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
    } catch (error) {
      console.error('Error in fetchAllData:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowAdmin(false);
      setAdminPassword('');
    } else {
      alert('Invalid password');
    }
  };

  const submitPayment = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addPayment', password: ADMIN_PASSWORD, ...paymentForm })
      });
      
      const result = await response.json();
      if (result.success) {
        alert('Payment added successfully!');
        setPaymentForm({
          flatNumber: '', amount: '', date: '', month: '', year: '',
          description: 'Monthly Maintenance', status: 'Paid'
        });
        fetchAllData();
      } else {
        alert('Error: ' + (result.error || 'Failed to add payment'));
      }
    } catch (error) {
      alert('Error adding payment');
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = (flatNumber) => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();
    
    const payment = payments.find(p => 
      p.Flat_Number == flatNumber && p.Month === currentMonth && p.Year == currentYear
    );
    
    return payment ? payment.Status : 'Pending';
  };

  const filteredApartments = apartments.filter(apt => 
    apt.Flat_Number.toString().includes(searchFlat)
  );

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  const paidCount = payments.filter(p => p.Month === currentMonth && p.Year == currentYear && p.Status === 'Paid').length;
  const collectionRate = apartments.length > 0 ? Math.round((paidCount / apartments.length) * 100) : 0;

  return React.createElement('div', { className: 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100' },
    // Header
    React.createElement('header', { className: 'bg-white shadow-lg border-b' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4 py-4' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('div', { className: 'flex items-center space-x-3' },
            React.createElement(Building),
            React.createElement('div', {},
              React.createElement('h1', { className: 'text-2xl font-bold text-gray-900' }, 'Siri Fortune'),
              React.createElement('p', { className: 'text-sm text-gray-600' }, 'Maintenance Tracker')
            )
          ),
          !isAuthenticated ? 
            React.createElement('button', {
              onClick: () => setShowAdmin(!showAdmin),
              className: 'flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            },
              React.createElement(Settings),
              React.createElement('span', {}, 'Admin')
            ) :
            React.createElement('div', { className: 'flex items-center space-x-2 text-green-600' },
              React.createElement(Settings),
              React.createElement('span', { className: 'text-sm font-medium' }, 'Admin Mode')
            )
        )
      )
    ),

    // Admin Login Modal
    showAdmin && !isAuthenticated && React.createElement('div', {
      className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    },
      React.createElement('div', { className: 'bg-white rounded-xl p-6 w-96' },
        React.createElement('h3', { className: 'text-lg font-bold mb-4' }, 'Admin Access'),
        React.createElement('div', { className: 'space-y-4' },
          React.createElement('input', {
            type: 'password',
            value: adminPassword,
            onChange: (e) => setAdminPassword(e.target.value),
            onKeyPress: (e) => e.key === 'Enter' && handleAdminLogin(),
            className: 'w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500',
            placeholder: 'Enter admin password'
          }),
          React.createElement('div', { className: 'flex space-x-3' },
            React.createElement('button', {
              onClick: handleAdminLogin,
              className: 'flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700'
            }, 'Login'),
            React.createElement('button', {
              onClick: () => setShowAdmin(false),
              className: 'flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400'
            }, 'Cancel')
          )
        )
      )
    ),

    // Navigation Tabs
    React.createElement('nav', { className: 'bg-white shadow' },
      React.createElement('div', { className: 'max-w-7xl mx-auto px-4' },
        React.createElement('div', { className: 'flex space-x-8' },
          [
            { id: 'apartments', label: 'Apartments' },
            { id: 'summary', label: 'Summary' },
            ...(isAuthenticated ? [{ id: 'payments', label: 'Add Payment' }] : [])
          ].map(({ id, label }) =>
            React.createElement('button', {
              key: id,
              onClick: () => setActiveTab(id),
              className: `py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`
            }, label)
          )
        )
      )
    ),

    // Main Content
    React.createElement('main', { className: 'max-w-7xl mx-auto px-4 py-8' },
      // Apartments Tab
      activeTab === 'apartments' && React.createElement('div', { className: 'space-y-6' },
        React.createElement('div', { className: 'flex items-center justify-between' },
          React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Apartment Status'),
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search flat number...',
            value: searchFlat,
            onChange: (e) => setSearchFlat(e.target.value),
            className: 'px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500'
          })
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' },
          apartments.length > 0 ? 
            filteredApartments.map((apt) => {
              const status = getPaymentStatus(apt.Flat_Number);
              const statusColor = status === 'Paid' ? '#10b981' : '#f59e0b';
              
              return React.createElement('div', {
                key: apt.Flat_Number,
                className: 'bg-white rounded-lg shadow-md p-4 border-l-4 hover:shadow-lg transition-shadow',
                style: { borderLeftColor: statusColor }
              },
                React.createElement('div', { className: 'flex justify-between items-start mb-2' },
                  React.createElement('h3', { className: 'font-bold text-lg' }, `Flat ${apt.Flat_Number}`),
                  React.createElement('span', {
                    className: `px-2 py-1 rounded-full text-xs font-medium ${
                      status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`
                  }, status)
                ),
                React.createElement('div', { className: 'text-sm text-gray-600 space-y-1' },
                  React.createElement('p', {}, `Floor: ${apt.Floor}`),
                  React.createElement('p', {}, `Owner: ${apt.Owner_Name || 'NA'}`),
                  React.createElement('p', { className: 'font-medium text-blue-600' }, `₹${apt.Maintenance_Amount}`)
                )
              );
            }) :
            React.createElement('div', { className: 'col-span-full text-center py-12' },
              loading ? 
                React.createElement('div', { className: 'text-gray-500' },
                  React.createElement('div', { className: 'animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2' }),
                  React.createElement('p', {}, 'Loading apartments...')
                ) :
                React.createElement('p', { className: 'text-gray-500 text-lg' }, 'No apartments found. Check console for errors.')
            )
        )
      ),

      // Summary Tab
      activeTab === 'summary' && React.createElement('div', { className: 'space-y-6' },
        React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Financial Summary'),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' },
          [
            { label: 'Total Apartments', value: apartments.length, icon: Building, color: 'blue' },
            { label: 'Paid This Month', value: paidCount, icon: DollarSign, color: 'green' },
            { label: 'Pending Payments', value: apartments.length - paidCount, icon: Users, color: 'orange' },
            { label: 'Collection Rate', value: `${collectionRate}%`, icon: TrendingUp, color: 'purple' }
          ].map(({ label, value, icon: Icon, color }) =>
            React.createElement('div', {
              key: label,
              className: `bg-white rounded-xl shadow-lg p-6 border-t-4 border-${color}-500`
            },
              React.createElement('div', { className: 'flex items-center justify-between' },
                React.createElement('div', {},
                  React.createElement('p', { className: 'text-sm font-medium text-gray-600' }, label),
                  React.createElement('p', { className: 'text-3xl font-bold text-gray-900 mt-1' }, value)
                ),
                React.createElement('div', { className: `p-3 rounded-full bg-${color}-100` },
                  React.createElement(Icon)
                )
              )
            )
          )
        )
      ),

      // Add Payment Tab
      activeTab === 'payments' && isAuthenticated && React.createElement('div', { className: 'space-y-6' },
        React.createElement('h2', { className: 'text-2xl font-bold text-gray-900' }, 'Add Payment'),
        React.createElement('div', { className: 'bg-white rounded-xl shadow-lg p-8 max-w-3xl' },
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
            React.createElement('div', {},
              React.createElement('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Flat Number'),
              React.createElement('select', {
                value: paymentForm.flatNumber,
                onChange: (e) => setPaymentForm({...paymentForm, flatNumber: e.target.value}),
                className: 'w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              },
                React.createElement('option', { value: '' }, 'Select Flat'),
                apartments.map(apt =>
                  React.createElement('option', { key: apt.Flat_Number, value: apt.Flat_Number },
                    `Flat ${apt.Flat_Number} (Floor ${apt.Floor})`
                  )
                )
              )
            ),
            React.createElement('div', {},
              React.createElement('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Amount (₹)'),
              React.createElement('input', {
                type: 'number',
                value: paymentForm.amount,
                onChange: (e) => setPaymentForm({...paymentForm, amount: e.target.value}),
                className: 'w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                placeholder: '2500'
              })
            ),
            React.createElement('div', {},
              React.createElement('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Date (DD-MM-YYYY)'),
              React.createElement('input', {
                type: 'text',
                value: paymentForm.date,
                onChange: (e) => setPaymentForm({...paymentForm, date: e.target.value}),
                className: 'w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                placeholder: '08-06-2025'
              })
            ),
            React.createElement('div', {},
              React.createElement('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Month'),
              React.createElement('select', {
                value: paymentForm.month,
                onChange: (e) => setPaymentForm({...paymentForm, month: e.target.value}),
                className: 'w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              },
                React.createElement('option', { value: '' }, 'Select Month'),
                ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December']
                .map(month =>
                  React.createElement('option', { key: month, value: month }, month)
                )
              )
            ),
            React.createElement('div', {},
              React.createElement('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Year'),
              React.createElement('input', {
                type: 'number',
                value: paymentForm.year,
                onChange: (e) => setPaymentForm({...paymentForm, year: e.target.value}),
                className: 'w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                placeholder: '2025'
              })
            ),
            React.createElement('div', {},
              React.createElement('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Status'),
              React.createElement('select', {
                value: paymentForm.status,
                onChange: (e) => setPaymentForm({...paymentForm, status: e.target.value}),
                className: 'w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              },
                React.createElement('option', { value: 'Paid' }, 'Paid'),
                React.createElement('option', { value: 'Pending' }, 'Pending')
              )
            )
          ),
          React.createElement('div', { className: 'mt-6' },
            React.createElement('label', { className: 'block text-sm font-medium mb-2 text-gray-700' }, 'Description'),
            React.createElement('input', {
              type: 'text',
              value: paymentForm.description,
              onChange: (e) => setPaymentForm({...paymentForm, description: e.target.value}),
              className: 'w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              placeholder: 'Monthly Maintenance'
            })
          ),
          React.createElement('button', {
            onClick: submitPayment,
            disabled: loading,
            className: `mt-8 w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              loading 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`
          }, loading ? 'Adding Payment...' : 'Add Payment')
        )
      )
    )
  );
};

ReactDOM.render(React.createElement(SiriFortuneApp), document.getElementById('root'));
