import "./Login.css";
import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getUserInfoFromToken, login } from "../api/user";
import { APP_CONTEXT } from "../App";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setUser } = useContext(APP_CONTEXT);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token"); // Kiểm tra token
    if (token) {
      navigate("/chat"); // Chuyển hướng nếu đã đăng nhập
    }
  }, [navigate]); // Chạy khi component được mount

  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    validationSchema: Yup.object({
      usernameOrEmail: Yup.string().required("Tài khoản không được để trống"),
      password: Yup.string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu phải dài từ 6-30 kí tự")
        .max(30, "Mật khẩu phải dài từ 6-30 kí tự"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await login(values.usernameOrEmail, values.password);

        if (res.status === 200) {
          if (res.data.data) {
            const userRes = await getUserInfoFromToken(
              res.data.data.accessToken
            );

            if (userRes.data.data) {
              setUser(userRes.data.data);
              navigate("/chat");
            }
            localStorage.setItem("token", res.data.data.accessToken);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div id="app">
      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div class="container">
            <div className="login-box">
              <div className="login-left">
                <img />
              </div>
              <div className="login-right">
                <div className="login-right-wrap">
                  <h1>Welcome to Dev Center</h1>
                  <p className="account-subtitle"></p>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label>
                        Tài khoản<span class="login-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="usernameOrEmail"
                        value={formik.values.usernameOrEmail}
                        onChange={formik.handleChange}
                      />

                      <div style={{ color: "red", fontWeight: 700 }}>
                        {formik.touched.usernameOrEmail &&
                          formik.errors.usernameOrEmail}
                      </div>
                    </div>
                    <div class="form-group">
                      <label>
                        Mật khẩu <span class="login-danger">*</span>
                      </label>
                      <input
                        class="form-control pass-input"
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                      <span
                        className="profile-views toggle-password"
                        onClick={togglePasswordVisibility}
                      >
                        {passwordVisible ? (
                          <i className="fas fa-eye"></i>
                        ) : (
                          <i className="fas fa-eye-slash"></i>
                        )}
                      </span>
                      <div style={{ color: "red", fontWeight: 700 }}>
                        {formik.touched.password && formik.errors.password}
                      </div>
                    </div>
                    <div class="forgot-pass">
                      <div className="remember-me"></div>
                    </div>
                    <div class="form-group">
                      <button
                        class="btn btn-primary btn-block defaultButton"
                        type="submit"
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </form>
                  {/* End Form */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    Bạn chưa có tài khoản{" "}
                    <Link to="/register">Tạo tài khoản</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
