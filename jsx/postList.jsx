import React, {Component} from 'react';
import PostData from '../JSON/1/test.json';

class PostList extends Component {
    
  render() {
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
    
  }

}

export default PostList;
