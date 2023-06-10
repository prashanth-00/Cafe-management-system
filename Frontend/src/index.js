import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import ReactDOM from "react-dom/client";
import {
  Link,
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import ManageCategories from "./Components/categories";
import Dashboard from "./Components/dashboard";
import ForgotPassword from "./Components/forgotoPassword";
import HomePage from "./Components/home";
import Login from "./Components/login";
import ManageUsers from "./Components/manageUsers";
import Order from "./Components/order";
import Products from "./Components/products";
import SignUp from "./Components/signup";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const NavLink = ({ to, text }) => {
  return (
    <Link
      to={to}
      style={{
        color: "white",
        textDecoration: "none",
        margin: "0 10px 0 10px",
      }}
    >
      {text}
    </Link>
  );
};

const Layout = () => {
  const { pathname } = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) return;
    setIsAdmin(role === "admin");
  }, [pathname]);

  if (pathname === "/") return <Outlet />;

  return (
    <Stack>
      <Navbar
        style={{ marginBottom: 20 }}
        collapseOnSelect
        expand="lg"
        bg="primary"
      >
        <Container>
          <Navbar.Brand style={{ color: "white" }}>
            Cafe Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {isAdmin && (
                <>
                  <NavLink to="/dashboard" text="Dashboard" />
                  <NavLink to="/products" text="Products" />
                  <NavLink to="/categories" text="Categories" />
                  <NavLink to="/manage-users" text="Users" />
                  <NavLink to="/orders" text="Order" />
                </>
              )}
            </Nav>
            <Nav>
              <Link
                to={"/"}
                onClick={() => {
                  localStorage.clear();
                }}
                style={{
                  color: "white",
                  textDecoration: "none",
                  margin: "0 10px 0 10px",
                  cursor: "pointer",
                }}
              >
                Logout
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>{isAdmin ? <Outlet /> : <Order />}</main>
    </Stack>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "orders",
        element: <Order />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "manage-users",
        element: <ManageUsers />,
      },
      {
        path: "categories",
        element: <ManageCategories />,
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "forgot-password",
    element: <ForgotPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

reportWebVitals();
