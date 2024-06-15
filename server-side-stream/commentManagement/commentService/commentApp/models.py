from django.db import models
from bson import ObjectId
import pymongo
import os

client = pymongo.MongoClient(os.getenv("MONGO_URI"))
db = client["commentManagement"]
Comment = db["comments"]


schema_validation = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "Section",
            "userId",
            "Comment",
            "Replies",
            "Likes",
            "profileImage",
            "likedUsers",
        ],
        "properties": {
            "_id": {"bsonType": "objectId"},
            "Section": {"bsonType": "string", "enum": ["shorts", "video", "post"]},
            "userId": {"bsonType": "string"},
            "LinkId": {"bsonType": "string"},
            "profileImage": {"bsonType": "string"},
            "Comment": {"bsonType": "string"},
            "Replies": {"bsonType": "array"},
            "Likes": {"bsonType": "number"},
            "likedUsers": {"bsonType": "array"},
        },
    }
}
db.command({"collMod": "comments", "validator": schema_validation})


# functions
def insertComment(data):
    Comment.insert_one(data)


def get_all_comments_grouped(cate):
    if cate not in ["shorts", "video", "post"]:
        raise ValueError(
            "Invalid category. Must be one of 'shorts', 'video', or 'post'."
        )
    objects = list(Comment.find())
    grouped_objects = {}
    for obj in objects:
        if obj["Section"] not in grouped_objects:
            grouped_objects[obj["Section"]] = []
        grouped_objects[obj["Section"]].append(obj)
    return grouped_objects.get(cate, [])

 

def upload_reply_comment(Data):
    Comment.update_one({"_id": ObjectId(Data["commentId"])}, {"$push": {"Replies": Data}})


def comment_like(data):
    userId = data["userId"]
    commentId = ObjectId(data["commentId"])
    comment = Comment.find_one({"_id": commentId})
    
    if userId in comment.get("likedUsers", []):
        print("User has already liked the comment.")
        Comment.update_one(
            {"_id": commentId}, 
            {"$pull": {"likedUsers": userId}, "$inc": {"Likes": -1}}
        )
    else:
        print("User has not liked the comment yet.")
        Comment.update_one(
            {"_id": commentId},
            {"$push": {"likedUsers": userId}, "$inc": {"Likes": 1}}
        ) 