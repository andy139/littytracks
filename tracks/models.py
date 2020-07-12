from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model


# Create your models here.
class Track(models.Model):
    # id is added automatically
    title = models.CharField(max_length=50)
    artist_name = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    url = models.URLField()
    img_url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    posted_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE) ##casecade if user deleted entire track will be deleted also
    
## class like

class Comment(models.Model):
    track = models.ForeignKey('tracks.Track', related_name='comments', on_delete=models.CASCADE)
    comment = models.TextField(blank=True)
    posted_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Subcomment(models.Model):
    comment = models.ForeignKey('tracks.Comment', related_name='subcomments', default="",
                                on_delete=models.CASCADE)
    subcomment = models.TextField(blank=True)
    posted_by = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Like(models.Model):
    user = models.ForeignKey(get_user_model(), null=True, on_delete=models.CASCADE)
    track = models.ForeignKey('tracks.Track', related_name='likes', on_delete=models.CASCADE)

class Play(models.Model):
    user = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)
    track = models.ForeignKey(
        'tracks.Track', related_name='plays', on_delete=models.CASCADE)

    ## REFERENCES THE USER FOR A GIVEN TRACK
class UserProfile(models.Model):
    avatar_url = models.URLField(default='')
    user = models.OneToOneField(User, on_delete=models.CASCADE,  null=True)
