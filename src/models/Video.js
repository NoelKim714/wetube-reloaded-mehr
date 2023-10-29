import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 50,
    },
    fileUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    createdAt: {
        type: Date, 
        required: true,
        default: Date.now()
    },
    hashtags: [{
        type: String,
        trim: true,
    }],
    meta: {
        views: { 
            type: Number, 
            default: 0, 
            required: true
        },
        rating: { 
            type: Number, 
            default: 0, 
            required: true},
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        
    },
});

videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags.split(", ").map((word) => (word.startsWith('#') ? word : `#${word}`));
});

//findByIdAndUpdate는 pre미들웨어 사용 불가
const Video = mongoose.model("Video", videoSchema);

export default Video;

