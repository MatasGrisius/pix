import * as React from 'react';
import { connect } from 'react-redux';
import * as PicturesStore from '../store/Pictures';
import { actionCreators } from '../store/WeatherForecasts';
import { thisExpression } from '@babel/types';


class Photo extends React.Component<any> {
  componentDidMount = () => {
    this.props.fetchPicture();
  }

  render = () => 
    <main role="main">
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">welcome to pix</h1>
          <p className="lead text-muted">your daily dose of pics, ideas and inspiration.</p>
          <p>
            <a href="#" className="btn btn-primary my-2">Main call to action</a>
            <a href="#" className="btn btn-secondary my-2">Secondary action</a>
          </p>
        </div>
      </section>
      <div className="album py-5 bg-light">
        <div className="container">
          <div className="row">
            
            {this.props.pictures && this.props.pictures.map((e) => <div 
              className="col-md-4"
              key={e.id}>
              <div className="card mb-4 shadow-sm">
                <svg              
                  onClick={() => console.log("hello")}
                  className="bd-placeholder-img card-img-top" 
                  width="100%" 
                  height={225} 
                  xmlns="http://www.w3.org/2000/svg" 
                  preserveAspectRatio="xMidYMid slice" 
                  focusable="false" 
                  role="img" 
                  aria-label="Placeholder: Thumbnail"
                  style={{cursor: "pointer"}}
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#55595c" />
                  <text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text>
                </svg>
                <div className="card-body">
                  <p>{e.name}</p>
                  <p className="card-text">{e.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                      <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                      <button onClick={() => console.log("other hello")}type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                      
                    </div>
                    <small className="text-muted">{e.comments ? e.comments.length : "No comments"}</small>
                  </div>
                </div>
              </div>
            </div>)}

          </div>
        </div>
      </div>
    </main>
};

export default connect(
  (state) => state["pictures"], // Selects which state properties are merged into the component's props
  PicturesStore.actionCreators // Selects which action creators are merged into the component's props
)(Photo);
