from django.urls import path
from . import views

urlpatterns = [
    path('add_comment', views.add_comment),
    path('add_comment_reply',views.add_comment_reply),
    path('like_comment',views.like_comment),
    path('get_all_comments_cate', views.get_all_comments_cate),
    path('get_comment_by_linkid', views.get_comment_by_linkid),
]
  