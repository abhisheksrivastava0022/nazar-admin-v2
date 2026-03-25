import Login from "../Auth/Login ";
import IntermediaryListing from "../Component/Intermediaries/IntermediaryListing";
import IntermediaryCreateUpdate from "../Component/Intermediaries/IntermediaryCreateUpdate";
import NotFound from "../Component/NotFound";
import VerifiedRequest from "../Component/Producer/VerifiedRequest";
import ApprovedListing from "../Component/Producer/ApprovedListing";
import ProducerListing from "../Component/Producer/ProducerListing";
import ProducerCreateUpdate from "../Component/Producer/ProducterCreateUpdate";
import RequestListing from "../Component/Producer/RequestListing";
import ChangePassword from "../Component/User/ChangePassword";
import UserCreate from "../Component/User/UserCreate";
import UserList from "../Component/User/UserList";
import UserUpdate from "../Component/User/UserUpdate";
import MainLayout from "../layout/MainLayout";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <RequestListing />,
      },
      {
        path: "/verified-request",
        element: <VerifiedRequest />,
      },
      {
        path: "/approved-request",
        element: <ApprovedListing />,
      },
      {
        path: "/user-request",
        element: <RequestListing />,
      },
      {
        path: "/producer",
        element: <ProducerListing />,
      },
      {
        path: "/producer/create",
        element: <ProducerCreateUpdate />,
      },
      {
        path: "/producer/update/:id",
        element: <ProducerCreateUpdate />,
      },
      {
        path: "/user",
        element: <UserList />,
      },
      {
        path: "/user/create",
        element: <UserCreate />,
      },
      {
        path: "/user/:id",
        element: <UserUpdate />,
      },
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/change-password/:id",
        element: <ChangePassword />,
      },

      {
        path: "/history",
        element: <History />,
      },

      {
        path: "/intermediary",
        element: <IntermediaryListing />,
      },
      {
        path: "/intermediary/create",
        element: <IntermediaryCreateUpdate />,
      },
      {
        path: "/intermediary/update/:id",
        element: <IntermediaryCreateUpdate />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
