import { useState, useEffect } from "react";

const useCookie = (cookieName) => {
  const [cookieValue, setCookieValue] = useState("");

  useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? decodeURIComponent(match[2]) : null;
    };

    setCookieValue(getCookie(cookieName));
  }, [cookieName]);

  return cookieValue;
};

export default useCookie;
