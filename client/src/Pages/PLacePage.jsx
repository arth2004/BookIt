import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookingWidget } from "../components/BookingWidget";
import AddressLink from "../components/AddressLink";
import PlaceGallery from "../components/PlaceGallery";

export default function PLacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios.get(`/places/${id}`).then((response) => {
        setPlace(response.data);
      });
    }
  }, [id]);

  if (!place) return "";

  return (
    <div className=" bg-gray-100 -mx-8 px-8 pt-8 ">
      <h1 className="text-3xl">{place.title} </h1>
      <AddressLink>{place.address}</AddressLink>
      <PlaceGallery place={place} />
      <div className="mt-8 mb-4 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
          <div className="my-4">
            <h2 className="font-semibold text-2xl ">Description</h2>
            {place.description}
          </div>
          Check-in:{place.checkIn} <br />
          Check-out:{place.checkOut} <br />
          Max number of guests: {place.maxGuests}
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 p-8 border-t">
        <div>
          <h2 className="font-semibold text-2xl">Extra info</h2>
        </div>
        <div className="mb-4 mt-2 xt-sm text-gray-700 leading-4">
          {place.extraInfo}
        </div>
      </div>
    </div>
  );
}
