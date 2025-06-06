import { Link, useParams } from "react-router-dom";
import PlacesFormPage from "./PLacesFormPage";
import AccountNav from "../components/AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div className="text-center">
        <Link
          className="inline-flex bg-primary text-white  gap-1 py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add new place
        </Link>
        <div className="m-4">
          {places.length > 0 &&
            places.map((place, index) => (
              <Link
                to={"/account/places/" + place._id}
                className="flex cursor-pointer gap-4 bg-gray-200 p-4 rounded-2xl mt-2"
                key={index}
              >
                <div className="flex h-40 bg-gray-300 rounded-2xl grow shrink-0">
                  <PlaceImg place={place} className="h-48 w-48  object-cover object-center" />
                </div>
                <div className="">
                  <h2 className="text-xl font-bold text-justify">
                    {place.title}
                  </h2>
                  <p className="text-base mt-2 text-justify ">
                    {place.description}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
