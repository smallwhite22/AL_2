import React, {Component} from 'react';
import PostData from '../JSON/1/test.json';
let ar = 1;
let pp = PostData[ar].ex;

class PostList extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    if (pp == false) {
      console.log('yes')
      return (

        <div>
          <h1>YES!!</h1>
          <h1>{PostData[3].ab}</h1>

          {PostData.map((postDetail, index) => {
            return (

              <div key={postDetail.n}>

                <h2 value={postDetail.en}>{postDetail.ab[0]}</h2>

              </div>
            )
          })}

        </div>

      )
    } else {
      console.log(pp)
      return (
        <p>no</p>
      )
    }


  }

}

export default PostList;
