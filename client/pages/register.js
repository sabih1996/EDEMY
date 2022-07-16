import { useEffect, useState } from "react";
import axios from "axios";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { notify } from "../utils/toast.util";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth/auth";
import { selectToken, selectUser } from "../store/auth/selector";

const Register = () => {
  const [name, setName] = useState("Ryan");
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
      const res = await axios.post(`/api/register`, {
        name,
        email,
        password,
      });
      notify("default", "you are signed up, welcome to Edemy!!");
      dispatch(authActions.signUp(res.data));
      router.push("/");
      setLoading(false);
    } catch (err) {
      notify("error", err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Register</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-4 p-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />

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
            disabled={!name || !email || !password || loading}
          >
            {loading ? <SyncOutlined spin /> : "Submit"}
          </button>
        </form>

        <p className="text-center p-3">
          Already registered?{" "}
          <Link href="/login">
            <a>Login</a>
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
