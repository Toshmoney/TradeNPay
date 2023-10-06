const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const BlogPostSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    slug:{
        type:String
    },
    summary:{
        type: String,
        required: true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type:String,
    },
    comments:{
        type:String,
    },
    cover_img:{
        type:String,
    },
    category:{
        type: String,
    }
},
{timestamps:true}
);

const Posts = model("Post", BlogPostSchema);
module.exports = Posts;