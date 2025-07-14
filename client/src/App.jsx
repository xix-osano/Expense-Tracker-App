import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ type: '', title: '', amount: '', category: '', date: '' });
  const [auth, setAuth] = useState({ email: '', password: '', isLoggedIn: false });
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: token }
      }).then(res => setExpenses(res.data));
    }
  }, [token]);

  const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAuthChange = (e) => setAuth({ ...auth, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/expenses', form, {
      headers: { Authorization: token }
    });
    setExpenses([...expenses, res.data]);
  };

  const login = async () => {
    const res = await axios.post('http://localhost:5000/api/auth/login', auth);
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    setAuth({ ...auth, isLoggedIn: true });
  };

  const register = async () => {
    await axios.post('http://localhost:5000/api/auth/register', {
      username: auth.email,
      email: auth.email,
      password: auth.password
    });
    login();
  };

  const categoryData = expenses.reduce((acc, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    return acc;
  }, {});

  const dailyData = expenses.reduce((acc, cur) => {
    const day = new Date(cur.date).toLocaleDateString();
    acc[day] = (acc[day] || 0) + cur.amount;
    return acc;
  }, {});

  if (!token) {
    return (
      <div className="p-4">
        <h2>Login/Register</h2>
        <input name="email" placeholder="Email" onChange={handleAuthChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleAuthChange} />
        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Expense Tracker</h1>
      <form onSubmit={handleSubmit} className="my-4">
        <input name="type" onChange={handleFormChange} placeholder="Type (income/expense)" />
        <input name="title" onChange={handleFormChange} placeholder="Title" />
        <input name="amount" type="number" onChange={handleFormChange} placeholder="Amount" />
        <input name="category" onChange={handleFormChange} placeholder="Category" />
        <input name="date" type="date" onChange={handleFormChange} />
        <button type="submit">Add</button>
      </form>

      <h3>Pie Chart - Category</h3>
      <Pie data={{
        labels: Object.keys(categoryData),
        datasets: [{
          label: 'Expenses by Category',
          data: Object.values(categoryData),
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56']
        }]
      }} />

      <h3 className="mt-8">Bar Chart - Daily</h3>
      <Bar data={{
        labels: Object.keys(dailyData),
        datasets: [{
          label: 'Daily Spending',
          data: Object.values(dailyData),
          backgroundColor: '#36a2eb'
        }]
      }} />
    </div>
  );
}

export default App;




// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }
