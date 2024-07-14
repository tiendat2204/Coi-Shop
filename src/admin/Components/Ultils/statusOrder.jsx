 export const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-900";
      case "Shipped":
        return "bg-blue-500/20 text-blue-900";
      case "Delivered":
        return "bg-green-500/20 text-green-900";
      case "Cancelled":
        return "bg-red-500/20 text-red-900";
      default:
        return "bg-gray-500/20 text-gray-900";
    }
  };