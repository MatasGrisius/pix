import * as React from "react";
import { connect } from "react-redux";
import * as AccountStore from "../store/Account";
import * as CommentsStore from "../store/Comments";
import { actionCreators } from "../store/WeatherForecasts";
import { thisExpression } from "@babel/types";
import Card from "reactstrap/lib/Card";
import CardImg from "reactstrap/lib/CardImg";
import CardBody from "reactstrap/lib/CardBody";
import CardTitle from "reactstrap/lib/CardTitle";
import CardSubtitle from "reactstrap/lib/CardSubtitle";
import CardText from "reactstrap/lib/CardText";
import Button from "reactstrap/lib/Button";
import Media from "reactstrap/lib/Media";
import Jumbotron from "reactstrap/lib/Jumbotron";
import FormGroup from "reactstrap/lib/FormGroup";
import Form from "reactstrap/lib/Form";
import Label from "reactstrap/lib/Label";
import Input from "reactstrap/lib/Input";
import { bindActionCreators } from "redux";

class Login extends React.Component<any> {
  constructor(props) {
    super(props);
  }

  submitForm = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    this.props.login(data.get("email"), data.get("password"));
  };

  render = () => {
    return (
      <div>
        <Form onSubmit={this.submitForm}>
          <FormGroup>
            <Label for="exampleEmail">Username</Label>
            <Input
              type="text"
              name="email"
              id="exampleEmail"
              placeholder="username"
            />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Password</Label>
            <Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="password"
            />
          </FormGroup>
          <Button>Login</Button>
        </Form>
      </div>
    );
  };
}

export default connect(
  state => state["pictures"], // Selects which state properties are merged into the component's props
  { ...AccountStore.actionCreators }
)(Login);
