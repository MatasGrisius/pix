import * as React from "react";
import { connect } from "react-redux";
import * as PicturesStore from "../store/Pictures";
import { withRouter } from "react-router";
import Breadcrumb from "reactstrap/lib/Breadcrumb";
import BreadcrumbItem from "reactstrap/lib/BreadcrumbItem";
import svg from "../excercise.svg";
import { history } from "./../index";

class Home extends React.Component<any> {
  componentDidMount = () => {
    this.props.fetchPictures();
    console.log(this.props);
  };

  render = () =>
    <main role="main">
      <section className="jumbotron text-center">
        <div className="container">
          <img src={svg} height={150} />
          <h1 className="jumbotron-heading">welcome to pix</h1>
          <p className="lead text-muted">
            your daily dose of pics, ideas and inspiration.
          </p>
          <p>
            {!this.props.account.account &&
              <a
                onClick={() => history.push("/login")}
                href="javascript:void()"
                className="btn btn-primary my-2"
              >
                Login
              </a>}
          </p>
        </div>
      </section>
      <div className="album py-5 bg-light">
        <div className="container">
          <div className="row">
            {this.props.pictures &&
              this.props.pictures.map(e =>
                <div className="col-md-4" key={e.id}>
                  <div className="card mb-4 shadow-sm">
                    <img
                      onClick={() => this.props.history.push("/photo/" + e.id)}
                      className="bd-placeholder-img card-img-top thumbnail"
                      width="100%"
                      height={225}
                      aria-label="Placeholder: Thumbnail"
                      style={{ cursor: "pointer" }}
                      src={e.content}
                    />
                    <div className="card-body">
                      <p>
                        {e.name}
                      </p>
                      <p className="card-text">
                        {e.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        {this.props.account.account &&
                          e.userId == this.props.account.account.id &&
                          <div className="btn-group">
                            <button
                              onClick={() =>
                                this.props.history.push("/photo/" + e.id)}
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                this.props.history.push("/editphoto/" + e.id)}
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                            >
                              Edit
                            </button>
                          </div>}
                        {/* 
                          // @ts-ignore */}
                        {Math.abs(new Date() - new Date(e.created)) <
                          1000 * 60 * 60 * 10 &&
                          <small className="text-muted">NEW</small>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </main>;
}

export default withRouter(
  //@ts-ignore
  connect(
    state => ({
      pictures: state["pictures"].pictures,
      account: state["account"],
    }), // Selects which state properties are merged into the component's props
    PicturesStore.actionCreators // Selects which action creators are merged into the component's props
  )(Home)
);
