import { useState, useEffect } from "react";
import { Menu } from "antd";
import Link from "next/link";
import {
  AppstoreOutlined,
  LogoutOutlined,
  CoffeeOutlined,
  LoginOutlined,
  UserAddOutlined,
  TeamOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { authActions } from "../store/auth/auth";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, selectUser } from "../store/auth/selector";
import axios from "axios";
import { toast } from "react-toastify";
import { routeActions } from "../store/route/route";
import { selectCurrentRoute } from "../store/route/selector";
const { Item, SubMenu, ItemGroup } = Menu;
import styles from "../public/css/test.scss";
const TopNav = () => {
  const [current, setCurrent] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const currentRoute = useSelector(selectCurrentRoute);

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
    dispatch(
      routeActions.current_route({ current_route: window.location.pathname })
    );
  }, [process.browser && window.location.pathname]);

  useEffect(() => {
    router.push(currentRoute);
  }, []);

  const logout = async () => {
    dispatch(authActions.logout());
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };

  return (
    <>
      <div className="sticky-top ">
        <h1 className={styles.textColor}></h1>
        <Menu mode="horizontal" selectedKeys={[current]}>
          <Item
            key="/"
            onClick={(e) => setCurrent(e.key)}
            icon={<AppstoreOutlined />}
          >
            <Link href="/">
              <a>App</a>
            </Link>
          </Item>

          {user && user.role && user.role.includes("Instructor") ? (
            <Item
              key="/instructor/course/create"
              onClick={(e) => setCurrent(e.key)}
              icon={<CarryOutOutlined />}
            >
              <Link href="/instructor/course/create">
                <a>Create Course</a>
              </Link>
            </Item>
          ) : (
            <Item
              key="/user/become-instructor"
              onClick={(e) => setCurrent(e.key)}
              icon={<TeamOutlined />}
            >
              <Link href="/user/become-instructor">
                <a>Become Instructor</a>
              </Link>
            </Item>
          )}

          {user === null && (
            <>
              <Item
                key="/login"
                onClick={(e) => setCurrent(e.key)}
                icon={<LoginOutlined />}
              >
                <Link href="/login">
                  <a>Login</a>
                </Link>
              </Item>

              <Item
                key="/register"
                onClick={(e) => setCurrent(e.key)}
                icon={<UserAddOutlined />}
              >
                <Link href="/register">
                  <a>Register</a>
                </Link>
              </Item>
            </>
          )}

          {user !== null && (
            <SubMenu
              icon={<CoffeeOutlined />}
              title={user && user.name}
              className="float-end"
            >
              <ItemGroup>
                <Item key="/user">
                  <Link href="/user">
                    <a>Dashboard</a>
                  </Link>
                </Item>
                <Item onClick={logout}>Logout</Item>
              </ItemGroup>
            </SubMenu>
          )}
          {user && user.role && user.role.includes("Instructor") && (
            <Item
              key="/instructor"
              onClick={(e) => setCurrent(e.key)}
              icon={<TeamOutlined />}
              className="float-end"
            >
              <Link href="/instructor">
                <a>Instructor</a>
              </Link>
            </Item>
          )}
        </Menu>
      </div>
    </>
  );
};

export default TopNav;
