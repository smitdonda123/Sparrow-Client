import React from "react";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useCookies } from "react-cookie";

function Login() {
  let navigate = useNavigate();

  const [cookies, setCookie, removeToken] = useCookies();

  let handleSubmit = async (values) => {
    // debugger;
    console.log(values);

    let res = await axios.post(
      "https://sparrow-attendance00.herokuapp.com/register/login",
      values
    );
    console.log(res.data)

    if (res.data.statusCode === 200) {
      if (res.data.role === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
      setCookie("token", res.data.token, { path: "/" });
      // setCookie("isRole", res.data.isRole, { path: "/" });
      setCookie("role", res.data.role, { path: "/" });

      alert("login success");
    } else if (res.data.statusCode === 403) {
      alert(res.data.message);
    } else {
      console.log(res.data.message);
    }
  };

  let loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Required"),
      password: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
      console.lg(values);
    },
  });

  return (
    <div>
      <section className="vh-100" style={{ backgroundcolor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                        Login
                      </p>
                      <form
                        className="mx-1 mx-md-4"
                        onSubmit={loginFormik.handleSubmit}
                      >
                        <div className="d-flex flex-row align-items-center mb-4">
                          <EmailIcon fontSize="large" className="me-3 mt-3" />
                          <div className="form-outline flex-fill mb-0">
                            <TextField
                              type="email"
                              placeholder="Your Email"
                              label="Your Email"
                              variant="standard"
                              fullWidth
                              name="email"
                              onBlur={loginFormik.handleBlur}
                              onChange={loginFormik.handleChange}
                              value={loginFormik.values.email}
                            />
                            {loginFormik.touched.email &&
                            loginFormik.errors.email ? (
                              <div style={{ color: "red" }}>
                                {loginFormik.errors.email}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="d-flex flex-row align-items-center mb-4">
                          <LockIcon fontSize="large" className="me-3 mt-3" />
                          <div className="form-outline flex-fill mb-0">
                            <TextField
                              type="password"
                              placeholder="Password"
                              label="Password"
                              variant="standard"
                              fullWidth
                              name="password"
                              onBlur={loginFormik.handleBlur}
                              onChange={loginFormik.handleChange}
                              value={loginFormik.values.password}
                            />
                            {loginFormik.touched.password &&
                            loginFormik.errors.password ? (
                              <div style={{ color: "red" }}>
                                {loginFormik.errors.password}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <Button type="submit" variant="contained" size="large">
                            Login
                          </Button>
                        </div>
                        {/* <p className="text-center">
                          <Button
                            onClick={() => navigate("/signup")}
                            className="text-dark shadow-none"
                            style={{ backgroundColor: "#ffff", border: "none" }}
                          >
                            <span className="text-muted">
                              Create New Account&nbsp;?&nbsp;
                            </span>
                            Signup
                          </Button>
                        </p> */}
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid"
                        alt="Sample image"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
