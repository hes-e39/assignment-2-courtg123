import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Link,
  Outlet,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";

import "./index.css";
import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";

const PageIndex = () => {
  return (
    <div>
      <h1 className="text-3xl font-mono text-lime-200 font-medium text-center mt-10">Assignment #1</h1>
      <h3 className="text-xl font-mono text-green-200 font-medium text-center mb-10">Courtney Cary</h3>
      <div className="text-center m-4 font-mono mb-10">
        <div className="text-opacity-15 text-white">
          <Link to="/" className="mx-3 underline decoration-solid text-blue-400 hover:text-blue-200">Timers</Link>
          |
          <Link to="/docs" className="mx-3 underline decoration-solid text-blue-400 hover:text-blue-200">Documentation</Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

const router = createHashRouter([
  {
    path: "/",
    element: <PageIndex />,
    children: [
      {
        index: true,
        element: <TimersView />,
      },
      {
        path: "/docs",
        element: <DocumentationView />,
      },
    ],
  },
]);

// biome-ignore lint/style/noNonNullAssertion: root html element is there
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
