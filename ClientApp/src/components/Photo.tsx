import * as React from "react";
import { connect } from "react-redux";
import * as PicturesStore from "../store/Pictures";
import * as CommentsStore from "../store/Comments";
import * as TagsStore from "../store/Tags";
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
import Breadcrumb from "reactstrap/lib/Breadcrumb";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import { history } from "./../index";
import ta from "time-ago";

class Photo extends React.Component<any> {
  constructor(props) {
    super(props);
    this.state = {
      newcomment: "",
      beingedited: -1,
    };
  }

  componentDidMount = () => {
    console.log("loading pictures");
    this.props.fetchPicture(this.props.match.params.id);
    this.props.fetchTags();
  };

  submitForm = event => {
    event.preventDefault();
    const data = new FormData(event.target);
    this.props.postComment(this.props.match.params.id, data.get("text"));
    this.setState({ newComment: "" });
  };

  findWithAttr = (array, attr, value) => {
    for (var i = 0; i < array.length; i += 1) {
      if (array[i][attr] === value) {
        return i;
      }
    }
    return -1;
  };

  commentRender = (picture, e) =>
    <Media
      style={{
        backgroundColor: "#ccf2ff",
        border: "1px black solid",
        borderRadius: "5px",
      }}
      key={e.id}
    >
      <Media body>
        <Media heading>
          <div>
            {e.user.username} <span style={{fontSize: 16}} className="text-muted">{ta.ago(e.created)}</span> 
          </div>
        </Media>

        {e.text}
      </Media>
      {this.props.account &&
        this.props.account.account &&
        e.userId == this.props.account.account.id &&
        <React.Fragment>
          {" "}{" "}
          <Button
            outline
            onClick={() => {
              this.setState({
                beingedited: e.id,
                editComment: picture.comments.filter(f => f.id == e.id)[0].text,
              });
            }}
          >
            Edit
          </Button>{" "}
          {" "}
          <Button
            outline
            onClick={() => this.props.deleteComment(picture.id, e.id)}
          >
            Delete
          </Button>
        </React.Fragment>}
    </Media>;

  getLikes: any = (picture, tag) => {
    if (!tag) {
      return [];
    }
    return picture.tagCounters.filter(
      f => f.tagId == tag.id && f.userId == this.props.account.account.id
    );
  };

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
    let beforeComments = [];
    let afterComments = [];
    if (picture.comments) {
      let index = this.findWithAttr(
        picture.comments,
        "id",
        this.state["beingedited"]
      );
      if (index == -1) {
        beforeComments = picture.comments;
      } else {
        beforeComments = picture.comments.slice(0, index);
        afterComments = picture.comments.slice(index + 1);
      }
    }
    return (
      <div role="main">
        <Breadcrumb>
          <BreadcrumbItem>
            <a onClick={() => history.push("/")} href="javascript:void()">
              Home
            </a>
          </BreadcrumbItem>
          <BreadcrumbItem active>Photo</BreadcrumbItem>
        </Breadcrumb>
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
              <CardSubtitle className="text-muted">
                Uploaded {ta.ago(new Date(picture.created))}
              </CardSubtitle>
              <CardText>
                {picture.description}
              </CardText>
              {this.props.account &&
                this.props.account.account &&
                this.props.account.account.id &&
                picture.tagCounters &&
                  this.props.tags && this.props.tags.map(e =>
                    <React.Fragment key={e.id}>
                      <Button
                        outline={this.getLikes(picture, e).length == 0}
                        onClick={() => {
                          if (this.getLikes(picture, e).length == 0) {
                            this.props.addTagCounter(picture.id, e.id);
                          } else {
                            this.props.deleteTagCounter(
                              picture.id,
                              this.getLikes(picture, e)[0].id
                            );
                          }
                        }}
                        color="info"
                      >
                        {e.name}:
                        {
                          picture.tagCounters.filter(f => f.tagId == e.id)
                            .length
                        }
                      </Button>
                    </React.Fragment>
                  )}
              {this.props.account.account && this.props.account.account.id == picture.userId &&
                <React.Fragment>
                  <hr />
                  <div>Management options:</div>
                  <Button
                    color="primary"
                    outline
                    onClick={() =>
                      this.props.history.push("/editphoto/" + picture.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    outline
                    onClick={() => this.props.deletePicture(picture.id)}
                  >
                    Delete
                  </Button>
                </React.Fragment>}
            </CardBody>
          </Card>
        </Jumbotron>
        <Jumbotron>
          <h2>Comments:</h2>
          {beforeComments.map(e => this.commentRender(picture, e))}
          {this.state["beingedited"] > -1 &&
            <React.Fragment>
              <Input
                type="textarea"
                name="editcomment"
                onChange={e => this.setState({ editComment: e.target.value })}
                value={this.state["editComment"]}
              />
              <Button
                onClick={() => {
                  this.props.editComment(
                    picture.id,
                    picture.comments.filter(
                      e => e.id == this.state["beingedited"]
                    )[0],
                    this.state["editComment"]
                  );
                  this.setState({ beingedited: -1 });
                }}
              >
                Save
              </Button>
            </React.Fragment>}
          {afterComments.map(e => this.commentRender(picture, e))}
          <hr />
          {this.props.account.account && <Form onSubmit={this.submitForm}>
            <FormGroup>
              <Label
                for="exampleText"
                style={{ textAlign: "center", textSize: "50" }}
              >
                Express your thoughts about this image below
              </Label>
              <Input
                type="textarea"
                name="text"
                id="exampleText"
                onChange={e => this.setState({ newComment: e.target.value })}
                value={this.state["newComment"]}
              />
            </FormGroup>
            <Button>Comment</Button>
          </Form>}
        </Jumbotron>
      </div>
    );
  };
}

export default connect(
  state => ({
    pictures: state["pictures"].pictures,
    account: state["account"],
    tags: state["tags"],
  }), // Selects which state properties are merged into the component's props
  {
    ...CommentsStore.actionCreators,
    ...PicturesStore.actionCreators,
    ...TagsStore.actionCreators,
  }
)(Photo);
