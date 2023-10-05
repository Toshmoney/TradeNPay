const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const BlogPostSchema = new Schema({
    title:{
        type:String,
        required: true,
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
        type:Schema.Types.ObjectId,
        ref: "User"
    },
    comments:{
        type:String,
    },
    cover_img:{
        type:String,
    },
    views:{
        type:Number,
        default:0,
    },
    category:{
        type: String,
    }
},
{timestamps:true}
);

const Posts = model("Post", BlogPostSchema);
module.exports = Posts;