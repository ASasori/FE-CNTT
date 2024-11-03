import instance from "./axios";
const login = (usernameOrEmail, password) => {
  return instance.post("/auth/login", {
    username: usernameOrEmail,
    password,
  });
};

const register = (data) => {
  return instance.post("/auth/register", {
    ...data,
    name: data.username,
  });
};

const getUserInfoFromToken = (accessToken) => {
  return instance.get(`/user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

export { login, register, getUserInfoFromToken };
