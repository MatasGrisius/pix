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
import Table from "reactstrap/lib/Table";
import Swal from "sweetalert2";
import Breadcrumb from 'reactstrap/lib/Breadcrumb';
import BreadcrumbItem from 'reactstrap/lib/BreadcrumbItem';
import { history } from './../index';

class ManageTags extends React.Component<any> {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  componentDidMount = () => {
    this.props.fetchTags();
  };

  render = () => {
    if (!this.props.tags) {
      console.log("no pictures");
      return null;
    }
    return (
      <div>
        <Breadcrumb>
          <BreadcrumbItem>
            <a onClick={() => history.push("/")} href="javascript:void()">
              Home
            </a>
          </BreadcrumbItem>
          <BreadcrumbItem active>Manage tags list</BreadcrumbItem>
        </Breadcrumb>
        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.tags &&
              this.props.tags.map(e =>
                <tr key={e.id}>
                  <th scope="row">1</th>
                  <td>
                    {e.name}
                  </td>
                  <td>
                    <Button
                      color="primary"
                      outline
                      onClick={() =>
                        Swal.fire({
                          title: "Enter new tag name",
                          input: "text",
                          inputValue: e.name,
                          inputAttributes: {
                            autocapitalize: "off",
                          },
                          showCancelButton: true,
                          confirmButtonText: "Rename",
                          showLoaderOnConfirm: true,
                          preConfirm: login =>
                            this.props.renameTag(e.id, login),
                          allowOutsideClick: () => !Swal.isLoading(),
                        })}
                    >
                      Rename
                    </Button>
                    <Button
                      color="danger"
                      outline
                      onClick={() => this.props.deleteTag(e.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )}
          </tbody>
        </Table>
        <hr/>
        <Form
          onSubmit={(e: any) => {
            e.preventDefault();
            this.props.addTag(this.state["text"]);
            this.setState({ text: "" });
          }}
        >
          <FormGroup>
            <Label for="name">Add new tag</Label>
            <Input
              type="text"
              name="name"
              onChange={e => this.setState({ text: e.target.value })}
              id="name"
              placeholder="name"
              value={this.state["text"] as string}
            />
          </FormGroup>
          <Button>Add</Button>
        </Form>
      </div>
    );
  };
}

export default connect(
  state => ({
    tags: state["tags"],
  }), // Selects which state properties are merged into the component's props
  {
    ...TagsStore.actionCreators,
  }
)(ManageTags);
