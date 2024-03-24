export const getSortBy = (key?: string) => {
  switch (key) {
    case "id":
      return "_id";
    default:
      return key;
  }
};
