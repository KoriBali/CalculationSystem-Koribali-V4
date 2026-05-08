import api from "../config/api";

export const loginUser = async ({ email, password }) => {
  // Mencari user berdasarkan email dan password di json-server
  const response = await api.get(`/users`, {
    params: { email, password },
  });

  // json-server me-return array. Jika kosong, berarti login gagal.
  if (response.data.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = response.data[0];

  // Simulasi token (karena json-server asli tidak me-return JWT)
  const fakeToken = `fake-jwt-token-${btoa(user.email)}`;

  return {
    token: fakeToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
