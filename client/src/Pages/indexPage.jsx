import { Link } from "react-router-dom";
import Header from "../components/header";
import { useEffect, useState } from "react";
import axios from "axios";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces([
        ...response.data,
        ...response.data,
        ...response.data,
        ...response.data,
        ...response.data,
        ...response.data,
      ]);
    });
  }, []);
  return (
    <div className="max-w-screen grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 p-4 ">
      {places.length > 0 &&
        places.map((place, index) => (
          <Link
          to={'/place/'+place._id}
            key={index}
          >
            <div className=" bg-gray-500 rounded-2xl ">
              {place.photos.length > 0 && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={"http://localhost:4000/uploads/" + place.photos[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold">{place.address}</h2>
            <h3 className="text-sm truncate ">{place.title}</h3>
            <div className="mt-1">
              <span className="font-bold">₹{place.price}</span> per night
            </div>{" "}
          </Link> 
        ))}
    </div>
  );
}
