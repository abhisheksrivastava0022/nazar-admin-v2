const statusConfig = {
  1: {
    label: "Pending",
    slug: "pending",
    bg: "#FFF3CD",
    text: "#856404",
  },

  2: {
    label: "Verified",
    slug: "verified",
    bg: "#D1ECF1",
    text: "#0C5460",
  },

  3: {
    label: "Approved",
    slug: "approved",
    bg: "#D4EDDA",
    text: "#155724",
  },

  4: {
    label: "Rejected",
    slug: "rejected",
    bg: "#F8D7DA",
    text: "#721C24",
  },

  5: {
    label: "Declined",
    slug: "declined",
    bg: "#F5C6CB",
    text: "#721C24",
  },

  6: {
    label: "Compliance",
    slug: "compliance",
    bg: "#E2E3E5",
    text: "#383D41",
  },

  7: {
    label: "Sent to Sehyog",
    slug: "send_to_sehyog",
    bg: "#CCE5FF",
    text: "#004085",
  },

  8: {
    label: "More Clarification Required",
    slug: "clarification_required",
    bg: "#FFE5B4",
    text: "#8A5700",
  },

  9: {
    label: "Information Received",
    slug: "information_received",
    bg: "#D1F0FF",
    text: "#055160",
  },

  10: {
    label: "Resolved",
    slug: "resolved",
    bg: "#C3F7D6",
    text: "#146C43",
  },
};

const useStatusConfig = () => {
  return statusConfig;
};

export default useStatusConfig;
