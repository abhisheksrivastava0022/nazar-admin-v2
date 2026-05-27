const HandleProducerAction = async ({
  selectedRequest,
  actionType,
  comment,
  postRequestApi,
  statusConfig,
}) => {
  try {
    if (!selectedRequest || !actionType) {
      return {
        status: false,
        message: "Request or action type missing",
      };
    }

    const endpointMap = {
      pending: "pending",

      verified: "verified",

      approved: "approved",

      rejected: "reject",

      declined: "declined",

      compliance: "compliance",

      send_to_sehyog: "send-to-sehyoug",

      clarification_required: "more-clarification-required",

      information_received: "information-received",

      resolved: "resolved",
    };

    const endpointSlug = endpointMap[actionType];

    if (!endpointSlug) {
      return {
        status: false,
        message: "Invalid action type",
      };
    }

    const endpoint = `api/producer/${selectedRequest.id}/${endpointSlug}`;

    const requestBody = {
      comment,
    };

    const response = await postRequestApi(endpoint, requestBody);

    const actionLabel =
      Object.values(statusConfig).find((item) => item.slug === actionType)
        ?.label || actionType;

    if (response.status) {
      return {
        status: true,

        message: `Request "${actionLabel}" successfully!`,

        data: response.data || null,
      };
    }

    return {
      status: false,

      message: response.message || `Failed to mark request as "${actionLabel}"`,
    };
  } catch (error) {
    console.error("HandleProducerAction Error:", error);

    return {
      status: false,

      message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
};

export default HandleProducerAction;
