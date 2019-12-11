import * as React from "react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import { Link } from "react-router-dom";
import "./NavMenu.css";
import { connect } from "react-redux";
import * as AccountStore from "../store/Account";
import svg from '../excercise.svg';

class NavMenu extends React.Component<any> {
  public state = {
    isOpen: false,
    isLogin: false,
  };

  public render() {
    return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3"
          light
        >
          <Container>
            <NavbarBrand tag={Link} to="/">
              <img src ={svg} height={30}></img> pix
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} className="mr-2" />
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={this.state.isOpen}
              navbar
            >
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">
                    Home
                  </NavLink>
                </NavItem>
                {this.props.account != null &&
                  <NavLink tag={Link} className="text-dark" to="/editphoto">
                  Add new photo
                </NavLink>}
                {this.props.account && this.props.account.role == "admin" &&
                  <NavLink tag={Link} className="text-dark" to="/managetags">
                  Manage tags list
                </NavLink>}
                {this.props.account == null &&
                  <NavItem>
                    <NavLink tag={Link} className="text-dark" to="/login">
                      Login
                    </NavLink>
                  </NavItem>}
                {this.props.account != null &&
                  <Button onClick={this.props.logout}>Logout</Button>}
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }

  private toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };
}

export default connect(
  state => state["account"], // Selects which state properties are merged into the component's props
  AccountStore.actionCreators // Selects which action creators are merged into the component's props
)(NavMenu);
