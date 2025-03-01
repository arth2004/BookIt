import { Route, Routes } from "react-router-dom";
import "./App.css";
import IndexPage from "./Pages/indexPage";
import LoginPage from "./Pages/loginPage";
import Layout from "./components/Layout";
import RegisterPage from "./Pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./userContext";
import ProfilePage from "./Pages/ProfilePage";
import PlacesPage from "./Pages/PlacesPage";
import PlacesFormPage from "./Pages/PLacesFormPage";
import PLacePage from "./Pages/PLacePage";
import { BookingPage } from "./Pages/BookingPage";
import { BookingsPage } from "./Pages/BookingsPage";
import { useEffect, useState } from "react";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<ProfilePage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} />
          <Route path="/place/:id" element={<PLacePage />} />
          <Route path="account/bookings" element={<BookingsPage />} />
          <Route path="account/bookings/:id" element={<BookingPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
