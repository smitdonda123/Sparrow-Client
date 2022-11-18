import * as React from "react";
import AdminSidebar from "../SeaderbarAndHeader";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Collapse from "@mui/material/Collapse";
import { useCookies } from "react-cookie";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonIcon from "@mui/icons-material/Person";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as yup from "yup";

const headCells = [
  {
    label: "#",
  },
  {
    label: "User Name",
  },
  {
    label: "Email",
  },
  {
    label: "role",
  },
  {
    label: "Action",
  },
];
let tempData = [];

function AdminDashboard() {
  let navigate = useNavigate();
  // const [cookies, removeToken] = useCookies();
  // // auth post method  and chacked token or not
  // let chackAuth = async () => {
  //   if (cookies.token) {
  //     let config = {
  //       headers: {
  //         token: cookies.token,
  //       },
  //     };
  //     // auth post method
  //     let res = await axios.post(
  //       "https://avadimpex.herokuapp.com/users/auth",
  //       { purpose: "validate access" },
  //       config
  //     );
  //     if (res.data.statusCode !== 200) {
  //       removeToken("token");
  //       removeToken("username");
  //       removeToken("email");
  //       navigate("/signin");
  //     }
  //   } else {
  //     navigate("/signin");
  //   }
  // };

  // React.useEffect(() => {
  //   chackAuth();
  // }, []);

  const [loader, setLoader] = React.useState(true);
  const [userRegisterData, setUserRegisterData] = React.useState([]);

  let getData = async () => {
    let data = await axios.get(
      "https://sparrow-attendance00.herokuapp.com/register/get-register"
    );
    setLoader(false);
    setUserRegisterData(data.data.result);
    tempData = [...data.data.result];
  };
  React.useEffect(() => {
    getData();
  }, []);

  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // checked logic start here
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userRegisterData.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isSelected = (name) => selected?.indexOf(name) !== -1;

  // Delete selected categoryData
  var handleDelete = () => {
    axios
      .post(
        "https://sparrow-attendance00.herokuapp.com/register/delete-register",
        selected
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          getData();
        }
      });
  };

  // Serchbar
  let [serchingData, setSerchingData] = React.useState("");
  let handleSearchData = (e) => {
    let serching = e.target.value;
    setSerchingData(serching);

    let serchData = tempData.filter((row) => {
      return Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(serching.toLowerCase());
    });
    if (serching !== "" || serching !== null) {
      setUserRegisterData(serchData);
    } else {
      setUserRegisterData(userRegisterData);
    }
  };

  const [open, setOpen] = React.useState(false);

  // add user
  const [modalShowForUser, setModalShowForUser] = React.useState(false);

  let handleSubmit = async (values) => {
    console.log(values);
    // if (values.role === "Admin") {
    //   values["isAdmin"] = true;
    // } else {
    //   values["isAdmin"] = false;
    // }
    let res = await axios.post(
      "https://sparrow-attendance00.herokuapp.com/register/register",
      values
    );
    if (res.data.statusCode === 200) {
      setModalShowForUser(false)
      alert(res.data.message);
    } else if (res.data.statusCode === 403) {
      alert(res.data.message);
    } else {
      console.log(res.data.message);
    }
  };

  let signUpFormik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      cpassword: "",
      role: "",
    },
    validationSchema: yup.object({
      userName: yup.string().required("Required"),
      email: yup.string().email("Invalid Email").required("Required"),
      password: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      cpassword: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      role: yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      handleSubmit(values);
    },
  });


  return (
    <>
      <AdminSidebar />
      {loader ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "85vh" }}
        >
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <Box sx={{ width: "100%", pb: "2%", pl: "2%", pr: "2%" }}>
          <div className="d-flex justify-content-end mb-3 mb-lg-4">
            <Button
              variant="contained"
              onClick={() => setModalShowForUser(true)}
            >
              Add User
            </Button>
          </div>
            <Paper sx={{ width: "100%" }}>
              <Toolbar
                className="border-top border-bottom"
                sx={{
                  pl: { sm: 2 },
                  pr: { xs: 1, sm: 1 },
                  ...(selected.length > 0 && {
                    bgcolor: (theme) =>
                      alpha(
                        theme.palette.primary.main,
                        theme.palette.action.activatedOpacity
                      ),
                  }),
                }}
              >
                {selected.length > 0 ? (
                  <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                  >
                    {selected.length} selected
                  </Typography>
                ) : (
                  <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                  >
                    User Data
                  </Typography>
                )}
                <form className="form-inline">
                  <input
                    id="serchbar-size"
                    className="form-control mr-sm-2"
                    type="search"
                    value={serchingData}
                    onChange={handleSearchData}
                    placeholder="Search"
                    aria-label="Search"
                  />
                </form>
                {selected.length > 0 ? (
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete()}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Toolbar>
              <TableContainer>
                <Table aria-labelledby="tableTitle">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center"></TableCell>
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          indeterminate={
                            selected.length > 0 &&
                            selected.length < userRegisterData.length
                          }
                          checked={
                            userRegisterData.length > 0 &&
                            selected.length === userRegisterData.length
                          }
                          onChange={handleSelectAllClick}
                          inputProps={{
                            "aria-label": "select all desserts",
                          }}
                        />
                      </TableCell>
                      {headCells.map((headCell, id) => {
                        return (
                          <TableCell
                            key={id}
                            className="table-header-content fontsize-content"
                            align="center"
                          >
                            {headCell.label}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userRegisterData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row, index) => {
                        const isItemSelected = isSelected(row._id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <>
                            <TableRow
                              hover
                              key={index}
                              role="checkbox"
                              onClick={(event) => handleClick(event, row._id)}
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              selected={isItemSelected}
                            >
                              <TableCell align="center">
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() => setOpen(!open)}
                                >
                                  {open ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              </TableCell>
                              <TableCell
                                className="fontsize-content"
                                padding="checkbox"
                              >
                                <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputProps={{
                                    "aria-labelledby": labelId,
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                                className="fontsize-content"
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="fontsize-content"
                              >
                                {row.userName}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="fontsize-content"
                              >
                                {row.email}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="fontsize-content"
                              >
                                {row.role}
                              </TableCell>
                              <TableCell
                                align="center"
                                className="fontsize-content"
                              >
                                <Button
                                  className="text-dark"
                                  onClick={() => {
                                    // context.setDetailOfWithdrawalFormId(row._id);
                                    // context.setuserRegisterDataFormShow(true);
                                    // context.setButtonFieldShow(false);
                                  }}
                                >
                                  <EditIcon />
                                </Button>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={6}
                              >
                                <Collapse
                                  in={open}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box sx={{ margin: 1 }}>
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      component="div"
                                    >
                                      Other Data
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      gutterBottom
                                      component="div"
                                    >
                                      password
                                    </Typography>

                                    {/* <Table size="small" aria-label="purchases">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Date</TableCell>
                                          <TableCell>Customer</TableCell>
                                          <TableCell align="right">
                                            Amount
                                          </TableCell>
                                          <TableCell align="right">
                                            Total price ($)
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                          <TableRow >
                                            <TableCell
                                              component="th"
                                              scope="row"
                                            >
                                              date
                                            </TableCell>
                                            <TableCell>
                                              customerId
                                            </TableCell>
                                            <TableCell align="right">11 
                                            </TableCell>
                                            <TableCell align="right">
                                              11
                                            </TableCell>
                                          </TableRow>
                                      </TableBody>
                                    </Table> */}
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                  </TableBody>
                </Table>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={userRegisterData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableContainer>
            </Paper>
          </Box>

          {/* modalShowForUser, setModalShowForUser */}
          {/* add user Form */}
          <Dialog
            fullWidth
            open={modalShowForUser}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Add User
              <IconButton
                aria-label="close"
                onClick={() => setModalShowForUser(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <form
                className="mx-1 mx-md-4"
                onSubmit={signUpFormik.handleSubmit}
              >
                <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i className="fas fa-user fa-lg me-3 fa-fw"></i> */}
                  <PersonIcon fontSize="large" className="me-3 mt-3" />
                  <div className="form-outline flex-fill mb-0">
                    {/* <input
                              type="text"
                              id="form3Example1c"
                              className="form-control"
                            />
                            <label className="form-label" for="form3Example1c">
                              Your Name
                            </label> */}
                    <TextField
                      type="text"
                      placeholder="Your Name"
                      label="Your Name"
                      variant="standard"
                      fullWidth
                      name="userName"
                      onBlur={signUpFormik.handleBlur}
                      onChange={signUpFormik.handleChange}
                      value={signUpFormik.values.userName}
                    />
                    {signUpFormik.touched.userName &&
                    signUpFormik.errors.userName ? (
                      <div style={{ color: "red" }}>
                        {signUpFormik.errors.userName}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i className="fas fa-envelope fa-lg me-3 fa-fw"></i> */}
                  <EmailIcon fontSize="large" className="me-3 mt-3" x />
                  <div className="form-outline flex-fill mb-0">
                    {/* <input
                              type="email"
                              id="form3Example3c"
                              className="form-control"
                            />
                            <label className="form-label" for="form3Example3c">
                              Your Email
                            </label> */}
                    <TextField
                      type="email"
                      placeholder="Your Email"
                      label="Your Email"
                      variant="standard"
                      fullWidth
                      name="email"
                      onBlur={signUpFormik.handleBlur}
                      onChange={signUpFormik.handleChange}
                      value={signUpFormik.values.email}
                    />
                    {signUpFormik.touched.email && signUpFormik.errors.email ? (
                      <div style={{ color: "red" }}>
                        {signUpFormik.errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i className="fas fa-lock fa-lg me-3 fa-fw"></i> */}
                  <LockIcon fontSize="large" className="me-3 mt-3" />
                  <div className="form-outline flex-fill mb-0">
                    {/* <input
                              type="password"
                              id="form3Example4c"
                              className="form-control"
                            />
                            <label className="form-label" for="form3Example4c">
                              Password
                            </label> */}
                    <TextField
                      type="password"
                      placeholder="Password"
                      label="Password"
                      variant="standard"
                      fullWidth
                      name="password"
                      onBlur={signUpFormik.handleBlur}
                      onChange={signUpFormik.handleChange}
                      value={signUpFormik.values.password}
                    />
                    {signUpFormik.touched.password &&
                    signUpFormik.errors.password ? (
                      <div style={{ color: "red" }}>
                        {signUpFormik.errors.password}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="d-flex flex-row align-items-center mb-4">
                  {/* <i className="fas fa-key fa-lg me-3 fa-fw"></i> */}
                  <VpnKeyIcon fontSize="large" className="me-3 mt-3" />
                  <div className="form-outline flex-fill mb-0">
                    {/* <input
                              type="password"
                              id="form3Example4cd"
                              className="form-control"
                            />
                            <label className="form-label" for="form3Example4cd">
                              Repeat your password
                            </label> */}
                    <TextField
                      type="password"
                      placeholder="Confirm Password"
                      label="Confirm Password"
                      variant="standard"
                      fullWidth
                      name="cpassword"
                      onBlur={signUpFormik.handleBlur}
                      onChange={signUpFormik.handleChange}
                      value={signUpFormik.values.cpassword}
                    />
                    {signUpFormik.touched.cpassword &&
                    signUpFormik.errors.cpassword ? (
                      <div style={{ color: "red" }}>
                        {signUpFormik.errors.cpassword}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-4">
                  <PersonIcon fontSize="large" className="me-3 mt-3" />
                  <div className="form-outline flex-fill mb-0">
                    <FormControl fullWidth variant="standard">
                      <InputLabel id="demo-simple-select-label">
                        Role
                      </InputLabel>
                      <Select
                        label="Role"
                        name="role"
                        onBlur={signUpFormik.handleBlur}
                        onChange={signUpFormik.handleChange}
                        value={signUpFormik.values.role}
                      >
                        <MenuItem value={"Admin"}>Admin</MenuItem>
                        <MenuItem value={"User"}>User</MenuItem>
                      </Select>
                    </FormControl>
                    {signUpFormik.touched.role && signUpFormik.errors.role ? (
                      <div style={{ color: "red" }}>
                        {signUpFormik.errors.role}
                      </div>
                    ) : null}
                  </div>
                </div>
                {/* <div className="form-check d-flex justify-content-center mb-5">
                          <FormGroup>
                            <FormControlLabel
                              control={<Checkbox defaultChecked />}
                              label="I agree all statements in"
                            />
                          </FormGroup>
                          <a href="#!">Terms of service</a>
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            value=""
                            id="form2Example3c"
                          />
                          <label className="form-check-label" for="form2Example3">
                            I agree all statements in
                            <a href="#!">Terms of service</a>
                          </label>
                        </div> */}

                <div className="d-flex justify-content-end mx-4 mb-3 mb-lg-4">
                  <Button variant="contained" size="large" type="submit">
                    Register
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}

export default AdminDashboard;
