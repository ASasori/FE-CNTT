import "./Register.css";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { APP_CONTEXT } from "../App";
import { getUserInfoFromToken, register } from "../api/user";

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(APP_CONTEXT);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      dataOfBirth: "",
      phoneNumber: "",
      address: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Tài khoản không được để trống"),
      password: Yup.string()
        .required("Mật khẩu không được để trống")
        .min(6, "Mật khẩu phải dài từ 6-30 kí tự")
        .max(30, "Mật khẩu phải dài từ 6-30 kí tự"),

      email: Yup.string().required("Trường này không được để trống"),

      dataOfBirth: Yup.string().required("Trường này không được để trống"),

      phoneNumber: Yup.string().required("Trường này không được để trống"),

      address: Yup.string().required("Trường này không được để trống"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await register(values);
        if (res.status === 200) {
          if (res.data.data) {
            navigate("/chat");

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
  console.log("formik", formik);

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
                  <h1>Welcome to Medical Chat Bot</h1>
                  <p className="account-subtitle"></p>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-group">
                      <label>
                        Tài khoản<span class="login-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                      />

                      <div style={{ color: "red", fontWeight: 700 }}>
                        {formik.touched.username && formik.errors.username}
                      </div>
                    </div>
                    <div class="form-group">
                      <label htmlFor="email">
                        Email <span class="login-danger">*</span>
                      </label>
                      <input
                        class="form-control pass-input"
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                      <div style={{ color: "red", fontWeight: 700 }}>
                        {formik.touched.email && formik.errors.email}
                      </div>
                    </div>
                    <div class="form-group">
                      <label htmlFor="phoneNumber">
                        SĐT <span class="login-danger">*</span>
                      </label>
                      <input
                        class="form-control pass-input"
                        name="phoneNumber"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                      />
                      <div style={{ color: "red", fontWeight: 700 }}>
                        {formik.touched.phoneNumber &&
                          formik.errors.phoneNumber}
                      </div>
                    </div>
                    <div class="form-group">
                      <label htmlFor="address">
                        Địa chỉ <span class="login-danger">*</span>
                      </label>
                      <input
                        class="form-control pass-input"
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                      />
                      <div style={{ color: "red", fontWeight: 700 }}>
                        {formik.touched.address && formik.errors.address}
                      </div>
                    </div>
                    <div class="form-group">
                      <label htmlFor="dataOfBirth">
                        Ngày sinh <span class="login-danger">*</span>
                      </label>
                      <input
                        class="form-control pass-input"
                        name="dataOfBirth"
                        type="date"
                        value={formik.values.dataOfBirth}
                        onChange={formik.handleChange}
                      />
                      <div style={{ color: "red", fontWeight: 700 }}>
                        {formik.touched.dataOfBirth &&
                          formik.errors.dataOfBirth}
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
                        Đăng ký
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
                    Bạn đã có tài khoản <Link to="/login">Đăng nhập</Link>
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

export default Register;
