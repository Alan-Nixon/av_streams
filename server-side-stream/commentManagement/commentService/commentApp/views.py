from django.http import JsonResponse
from django.shortcuts import render
from . import models
import json
from bson import ObjectId


def add_comment(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            data["Likes"] = 0
            data["Replies"] = []
            data["likedUsers"] = []
            print(data)
            models.insertComment(data)
            return JsonResponse({"message": "Appo post route set aaytoo"})
        else:
            return JsonResponse({"message": "Requesting as get error try post"})
    except Exception as e:
        return JsonResponse({"message": str(e)})


def get_all_comments_cate(request):
    try:
        if request.method == "GET":
            query = json.loads(request.GET.get("query")).get("cate")
            data = list(reversed(models.get_all_comments_grouped(query)))
            data = convert_to_json(data)
            return JsonResponse({"data": data, "message": "Appo get route  aaytoo"})
        else:
            return JsonResponse({"message": "Requesting as post error try get"})
    except:
        return JsonResponse({"message": "Requesting as post error try get"})


def convert_to_json(data):
    for item in data:
        item["_id"] = str(item["_id"])
        for reply in item.get("Replies", []):
            reply["_id"] = str(reply.get("_id"))
    json_object = json.dumps(data, indent=4)
    return json_object


def add_comment_reply(request):
    if request.method == "POST":
        data = json.loads(request.body)
        models.upload_reply_comment(data)
        return JsonResponse({"message": "success"})
    else:
        return JsonResponse({"message": "Requesting as get error try post"})


def like_comment(request):
    try:
        if request.method == "PATCH":
            data = json.loads(request.body)
            models.comment_like(data)
            return JsonResponse({"message": "success"})
        else:
            return JsonResponse({"message": "Requesting as get error try patch"})
    except:
        return JsonResponse({"message": "internal server error occured"})


def get_comment_by_linkid(request):
    try:
        if request.method == "GET":
            query = json.loads(request.GET.get("query"))
            data = list(reversed(models.get_all_comments_grouped(query.get("cate"))))
            filtered_comments = [
                comment
                for comment in data
                if comment.get("LinkId") == query.get("linkId")
            ]
            print(filtered_comments,query)
            return JsonResponse(
                {
                    "message": "successfully fetched",
                    "data": convert_to_json(filtered_comments),
                }
            )
        else:
            return JsonResponse({"message": "make get request please"})
    except:
        return JsonResponse({"message": "internal server error occured"})
