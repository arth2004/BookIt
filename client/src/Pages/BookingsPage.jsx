import React, { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../components/BookingDates";

export const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />

      <div className="flex flex-col gap-4">
        {bookings?.length > 0 ? (
          bookings.map((booking) => (
            <Link
              to={`/account/bookings/${booking._id}`}
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="w-32">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 grow pr-3">
                <h2 className="text-3xl">{booking.place.title}</h2>
                {/* <div className="border-t border-gray-300 mt-2 py-2 flex gap-2 items-center "></div> */}
                <div className="text-xl">
                  <BookingDates
                    booking={booking}
                    className="mb-2 mt-6 text-gray-500"
                  />
                  <div className="flex gap-1 items-center mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                      />
                    </svg>
                    <span className="text-2xl">
                      Total Price: ₹{booking.price}/-
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex justify-center items-center text-red-500">
            <div>
              <h1 className="text-5xl font-bold ">
                No Booking Made Yet <Link to="/">Go to Home</Link>{" "}
              </h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
