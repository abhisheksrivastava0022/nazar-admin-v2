import Login from "../Auth/Login ";
import IntermediaryListing from "../Component/Intermediaries/IntermediaryListing";
import IntermediaryCreateUpdate from "../Component/Intermediaries/IntermediaryCreateUpdate";
import NotFound from "../Component/NotFound";
import ProducerListing from "../Component/Producer/ProducerListing";
import ProducerCreateUpdate from "../Component/Producer/ProducterCreateUpdate";
import RequestListing from "../Component/Producer/RequestListing";
import MainLayout from "../layout/MainLayout";
// import RequestComplaintDetails from "../Component/Producer/Request/RequestComplaintDetails";
import RequestComplaintDetails from "../Component/Producer/Request/RequestComplaintDetails copy";
import RenderOutlet from "../RenderOutlet";
import OverViewLayout from "../New/Overview/OverViewLayout";
import ComplantsListing from "../New/Complants/ComplantsListing";
import FilmsListing from "../New/Films/FilmsListing";
import FilmDetails from "../New/Films/FilmDetails";
import ComplaintDetails from "../New/Complants/ComplantsDetails";

export const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <OverViewLayout />,
      },
      {
        path: "/complants",
        element: <RenderOutlet />,
        children: [
          {
            index: true,
            element: <ComplantsListing />,
          },
          {
            path: ":id",
            element: <ComplaintDetails />,
          },
        ],
      },
      {
        path: "/films",
        element: <RenderOutlet />,
        children: [
          {
            index: true,
            element: <FilmsListing />,
          },
          {
            path: ":id",
            element: <FilmDetails />,
          },
        ],
      },
      // {
      //   index: true,
      //   element: <RequestListing />,
      // },
      {
        path: "/user-request",
        element: <RenderOutlet />,
        children: [
          {
            index: true,
            element: <RequestListing />,
          },
          {
            path: "request-complaint-details/:id",
            element: <RequestComplaintDetails />,
          },
        ],
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
