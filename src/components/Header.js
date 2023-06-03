import { Container, Navbar } from "react-bootstrap";
import { useDispatch } from "react-redux";
import "../assets/css/index.scss";
import { toggleLogin } from "../Redux/Slices/AuthSlice";

const Header = (props) => {
  const dispatch = useDispatch();

  return (
    <Navbar className="navbar-nav">
      <Container className="d-flex">
        <div className="mr-auto p-2">

        </div>
        <h4 className="span-color-white">Multi-lingual Machine Translator</h4>
        <div className="p-2">
          {props.showAvatar && (
            <Navbar.Brand onClick={() => dispatch(toggleLogin('Logout'))}>
              <img
                alt=""
                src={"http://nregsmp.org/eService/images/User.png"}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              <span style={{ color: "white" }}>{props.userName}{" "}</span>
            </Navbar.Brand>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;
