import './App.css';

// Router
import {BrowserRouter, Routes, Route  , Navigate} from "react-router-dom"

// Hooks
import { useAuth } from './hooks/useAuth';
import { useSelector } from 'react-redux';
import { useAuthAdmin } from './hooks/useAuthAdmin';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LoginAdmin from './pages/Auth/LoginAdmin';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import MyCars from './pages/MyCars/MyCars';
import AddCar from './pages/AddCar/AddCar';
import MyWashes from './pages/MyWashs/MyWashes';
import MyUsers from './pages/MyUsers/MyUsers';
import HomeAdmin from './pages/Home/HomeAdmin';
import AddWasher from './pages/AddWasher/AddWasher';
import UserCars from './pages/UsersCars/UserCars';
import AddWash from './pages/AddWash/AddWash';
import Assessments from './pages/Assessments/Assessments';
import AllWashes from './pages/AllWashes/AllWashes';
import Times from './pages/Times/Times';

function App() {
  const {auth, loading} = useAuth()
  const { authAdmin } = useAuthAdmin()
  const { user } = useSelector((state) => state.auth)

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <div className="container">
        <Routes>
          <Route path="/login_admin" element={authAdmin ? <Navigate to="/home_admin" /> : <LoginAdmin />} />
          <Route path="/home_admin" element={authAdmin ? <HomeAdmin /> : <Navigate to="/login_admin" />} />
          <Route path="/users" element={authAdmin ? <MyUsers /> : <Navigate to="/login_admin" />}/>
          <Route path="/addwasher" element={authAdmin ? <AddWasher /> : <Navigate to="/login_admin" />} />
          <Route path="/userscars/:id" element={authAdmin ? <UserCars /> : <Navigate to ="/login_admin" />} />
          <Route path="/allwashes" element={authAdmin ? <AllWashes /> : <Navigate to="/login_admin" />}/>
          <Route path="/times/:id" element={authAdmin ? <Times /> : <Navigate to="/login_admin" />} />
          {!auth && !authAdmin ? (
          <Route path="/" element={<Navigate to="/login" />} />
          ) : (
            <>
              {auth && (
                <Route
                  path="/"
                  element={<Navigate to={`/${user?._id ?? ""}`} />}
                />
              )}
              {authAdmin && (
                <Route path="/" element={<Navigate to="/home_admin" />} />
              )}
            </>
          )}
          <Route path="/assessments/:id" element={auth || authAdmin ? <Assessments /> : <Navigate to="/login" />} />
          <Route path="/:id" element={auth ? <Home /> : <Navigate to="/login" />} />
          <Route path="/washes/:id" element={auth ? <MyWashes /> : <Navigate to="/login" />}/>
          <Route path="/cars/:id" element={auth ? <MyCars /> : <Navigate to="/login" />}/>
          <Route path="/addcar/:id" element={auth ? <AddCar /> : <Navigate to="/login" />} />
          <Route path="/addwash/:id" element={auth ? <AddWash /> : <Navigate to="/login" />} />
          <Route path="/login" element={!auth ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!auth ? <Register /> : <Navigate to="/" />}/>
        </Routes>
        </div>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;