import React, { useContext, useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import { AuthContext } from "./context/AuthProvider";

const App = () => {
  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const authData = useContext(AuthContext);

  useEffect(() => {
    if (authData) {
      const loggedInUser = localStorage.getItem("loggedInUser");
      if (loggedInUser) {
        const parsedUser = JSON.parse(loggedInUser);
        setUser(parsedUser.role);

        if (parsedUser.role === "employee") {
          const employee = authData.employees.find(
            (e) => e.email === parsedUser.email
          );
          setLoggedInUserData(employee);
        }
      }
    }
  }, [authData]);

  const handleLogin = (email, password) => {
    if (email === "admin@me.com" && password === "123") {
      setUser("admin");
      localStorage.setItem("loggedInUser", JSON.stringify({ role: "admin" }));
    } else if (authData) {
      const employee = authData.employees.find(
        (e) => e.email === email && e.password === password
      );
      if (employee) {
        setUser("employee");
        setLoggedInUserData(employee);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ role: "employee", email: employee.email })
        );
      } else {
        alert("Invalid username or password");
      }
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <>
      {!user ? <Login handleLogin={handleLogin} /> : null}
      {user === "admin" ? (
        <AdminDashboard changeUser={setUser}/>
      ) : user === "employee" ? (
        <EmployeeDashboard data={loggedInUserData} changeUser={setUser}/>
      ) : null}
    </>
  );
};

export default App;
