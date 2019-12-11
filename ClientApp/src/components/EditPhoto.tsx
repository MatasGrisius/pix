import * as React from "react";
import { connect } from "react-redux";
import * as PicturesStore from "../store/Pictures";
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
import FormText from "reactstrap/lib/FormText";
import Breadcrumb from "reactstrap/lib/Breadcrumb";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import { history } from "..";
import Swal from "sweetalert2";

class EditPhoto extends React.Component<any> {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    if (this.props.match.params.id) {
      console.log("loading pictures");
      this.props.fetchPicture(this.props.match.params.id);
    }
  };

  submitForm = async event => {
    event.preventDefault();
    const data = new FormData(event.target);
    console.log(data.get("file"));
    let picture: any = {};
    ["name", "description"].forEach(e => {
      picture[e] = data.get(e);
    });
    picture.content = await this.toBase64(data.get("file"));
    if (this.props.match.params.id) {
      if (picture.content == "data:") {
        picture.content = this.props.pictures.filter(
          e => e.id == this.props.match.params.id
        )[0].content;
      }
    } else {
      if (picture.content == "data:") {
        picture.content = "";
      }
    }
    if (picture.name.length == "") {
      Swal.fire(
        "Validation error...",
        "Please input name",
        "error"
      );
    } else if (picture.content == "") {
      Swal.fire(
        "Validation error...",
        "Please input photo",
        "error"
      );
    } else {
      if (this.props.match.params.id) {
        this.props.editPicture(this.props.match.params.id, picture);
      } else {
        this.props.addPicture(picture);
      }
    }
  };

  toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  render = () => {
    let picture: any = {};
    if (this.props.match.params.id) {
      if (!this.props.pictures) {
        console.log("no pictures");
        return null;
      }
      picture = this.props.pictures.filter(
        e => e.id == this.props.match.params.id
      );
      if (!picture || picture.length == 0) {
        console.log("picture not found");
        return null;
      } else {
        picture = picture[0];
      }
    }
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <a onClick={() => history.push("/")} href="javascript:void()">
              Home
            </a>
          </BreadcrumbItem>
          <BreadcrumbItem active>
            {this.props.match.params.id ? "Edit photo" : "Add photo"}
          </BreadcrumbItem>
        </Breadcrumb>
        <Form onSubmit={this.submitForm}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="name"
              defaultValue={picture.name}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              placeholder="description"
              defaultValue={picture.description}
            />
          </FormGroup>
          <FormGroup>
            <Label for="file">Image</Label>
            <Input type="file" name="file" id="file" />
            <FormText color="muted">
              {picture.content &&
                <React.Fragment>
                  Leave file input empty in order to leave old image file
                  unchanged
                </React.Fragment>}
            </FormText>
          </FormGroup>
          <Button>{this.props.match.params.id ? "Edit photo" : "Upload new picture"}</Button>
        </Form>
      </div>
    );
  };
}

export default connect(
  state => state["pictures"], // Selects which state properties are merged into the component's props
  { ...PicturesStore.actionCreators }
)(EditPhoto);
