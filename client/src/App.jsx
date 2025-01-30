import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import About from './Pages/About';
import SignUp from './Pages/SignUp';
import Header from './Pages/Header';
import SignIn from './Pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './components/CreateListing';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;