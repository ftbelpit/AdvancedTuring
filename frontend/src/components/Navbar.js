import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, reset } from "../slices/authSlice";
import { logoutAdmin, resetAdmin } from "../slices/adminAuthSlice";
import { useAuthAdmin } from "../hooks/useAuthAdmin";
import logo from "../assets/turingwash-logo.svg";

const Navbar = () => {
  const { auth } = useAuth();
  const { authAdmin } = useAuthAdmin();
  const { user: userAuth } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  const handleLogoutAdmin = () => {
    dispatch(logoutAdmin());
    dispatch(resetAdmin());
    navigate("/login");
  };

  const isMeusCarrosPage = window.location.pathname.includes("/cars/");
  const isMinhasLavagensPage = window.location.pathname.includes("/washes/");
  const isAgendarLavagemPage = window.location.pathname.includes("/addwash/");
  const isAvaliarLavadorPage = window.location.pathname.includes("/assessments/");
  const isMeusUsuariosPage = window.location.pathname.includes("/users");  
  const isTodasAsLavagensPage = window.location.pathname.includes("/allwashes");  

  return (
    <nav id="nav">
      {authAdmin ? (
        <>
          <NavLink to="/home_admin">
            {isMeusUsuariosPage || isTodasAsLavagensPage ? (
              <span>Início</span>
            ) : (
              <img src={logo} alt="Turing Wash" className="logo" />
            )}
          </NavLink>
          <ul id="nav-links">
            <li>
              <NavLink to="/users">
                <span>Meus usuários</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/allwashes">
                <span>Todas as lavagens</span>
              </NavLink>
            </li>
            <li>
              <span className="exit" onClick={handleLogoutAdmin}>
                Sair
              </span>
            </li>
          </ul>
        </>
      ) : (
        <>
          {auth && (
            <>
              <NavLink to={`/${userAuth?._id ?? ""}`}>
                {isMeusCarrosPage || isMinhasLavagensPage || isAgendarLavagemPage || isAvaliarLavadorPage ? (
                  <span>Início</span>
                ) : (
                  <img src={logo} alt="Turing Wash" className="logo" />
                )}
              </NavLink>
              <ul id="nav-links">
                {userAuth && (
                  <li>
                    <NavLink to={`/cars/${userAuth._id}`}>
                      <span>Meus carros</span>
                    </NavLink>
                  </li>
                )}
                {userAuth && (
                  <li>
                    <NavLink to={`/washes/${userAuth._id}`}>
                      <span>Minhas lavagens</span>
                    </NavLink>
                  </li>
                )}
                <li>
                  <span className="exit" onClick={handleLogout}>
                    Sair
                  </span>
                </li>
              </ul>
            </>
          )}
          {!auth && !authAdmin && (
            <>
              {isMeusCarrosPage || isMinhasLavagensPage || isAgendarLavagemPage || isAvaliarLavadorPage ? (
                <span>Início</span>
              ) : (
                <img src={logo} alt="Turing Wash" className="logo" />
              )}
              <ul id="nav-links">
                <li>
                  <NavLink to="/login">
                    <span>Entrar</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register">
                    <span>Cadastrar</span>
                  </NavLink>
                </li>
              </ul>
            </>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
