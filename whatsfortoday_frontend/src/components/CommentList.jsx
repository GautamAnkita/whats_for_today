import React from "react";
import CommentDetails from "./CommentDetails";

const CommentList = props =>{
    const {comments = [], onCommentDeleteClick = () => {} } = props;

    return(
        <ul>
            {comments.map(comment =>(
                <li key = {comment.id}>
                <CommentDetails onDeleteClick={onCommentDeleteClick} {...comment} />
                </li>
            ))}

        </ul>
    );
};

export default CommentList;