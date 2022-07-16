import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth/auth";
import { useRouter } from "next/router";
import { notify } from "../utils/toast.util";
import { selectToken, selectUser } from "../store/auth/selector";

const Login = () => {
  const [email, setEmail] = useState("ryan@gmail.com");
  const [password, setPassword] = useState("rrrrrr");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user !== null && token !== null) {
      router.push("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`/api/login`, {
        email,
        password,
      });
      console.log(res);
      dispatch(authActions.login(res.data));
      notify("success", "you are logged in successfully");
      router.push("/user");
    } catch (err) {
      toast(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
            className="btn btn-block btn-primary"
            disabled={!email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>

        <p className="text-center p-3">
          Not yet registered?{" "}
          <Link href="/register">
            <a>Register</a>
          </Link>
        </p>
        <p className="text-center">
          <Link href="/forgot-password">
            <a className="text-danger">Forgot password</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
