// Call API to perform baseplate calculation
export const calculateBaseplate = async (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        anchorTension: 500,
        baseplateStress: 120,
        status: "OK",
      });
    }, 500);
  });
};
