import React from "react";

const CommentDetails = props => {
  const { onDeleteClick = () => {} } = props;
  console.log(props);
  return (
    <div>
      <p>{props.body}</p>
      <p>By {props.user_first_name}</p>
      <p>Created At: {new Date(props.created_at).toLocaleString()}</p>
      <p>
        <button onClick={() => onDeleteClick(props.id)}>Delete</button>
        {" • "}
        {/* <Field
          name="Created At"
          value={new Date(props.created_at).toLocaleString()}
        /> */}
      </p>
    </div>
  );
};

export default CommentDetails;