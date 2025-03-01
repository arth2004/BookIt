import { Outlet } from "react-router-dom";
import Header from "./header";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen gap-20">
      <div className="">
        <Header />
      </div>
      <div className="px-4 ">
        <Outlet />
      </div>
    </div>
  );
}
