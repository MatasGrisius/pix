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

class Photo extends React.Component<any> {
  constructor(props) {
    super(props);
    this.state = "";
  }

  componentDidMount = () => {
    console.log("loading pictures");
    this.props.fetchPicture(this.props.match.params.id);
  };

  submitForm = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    this.props.postComment(this.props.match.params.id, data.get('text'));
  }

  render = () => {
    if (!this.props.pictures) {
      console.log("no pictures");
      return null;
    }
    let picture = this.props.pictures.filter(
      e => e.id == this.props.match.params.id
    );
    if (!picture || picture.length == 0) {
      console.log("picture not found");
      return null;
    } else {
      picture = picture[0];
    }
    console.log(picture);
    return (
      <div role="main">
        <Jumbotron>
          <Card>
            <CardImg
              top
              width="100%"
              src={picture.content}
              alt="Card image cap"
            />
            <CardBody>
              <CardTitle>
                {picture.name}
              </CardTitle>
              <CardSubtitle>
                {picture.created}
              </CardSubtitle>
              <CardText>
                {picture.description}
              </CardText>
              <Button onClick={() => this.props.history.push('/photo/' + picture.id)}>Edit</Button>
              <Button onClick={() => this.props.deletePicture(picture.id)}>Delete</Button>
            </CardBody>
          </Card>
        </Jumbotron>
        <Jumbotron>
          Comments:
          {picture.comments && picture.comments.map(e =>
            <Media style={{ border: "1px black solid" }} key={e.id}>
              <Media body>
                <Media heading>{e.text}</Media>
                {e.created}
              </Media>
            </Media>
          )}
          <Form onSubmit={this.submitForm}>
            <FormGroup>
              <Label for="exampleText">Express your thoughts about this image below</Label>
              <Input type="textarea" name="text" id="exampleText" />
            </FormGroup>
            <Button >Submit</Button>
          </Form>
        </Jumbotron>
      </div>
    );
  };
}

export default connect(
  state => state["pictures"], // Selects which state properties are merged into the component's props
  {...CommentsStore.actionCreators, ...PicturesStore.actionCreators}
)(Photo);
