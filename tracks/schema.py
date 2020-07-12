import graphene

from graphene_django import DjangoObjectType
from graphql import GraphQLError
from .models import Track, Like, Play, UserProfile, Comment, Subcomment
from users.schema import UserType
from django.db.models import Q
from .utils import get_paginator


class TrackType(DjangoObjectType):
    class Meta:
        model = Track


class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile


class LikeType(DjangoObjectType):
    class Meta:
        model = Like


class PlayType(DjangoObjectType):
    class Meta:
        model = Play


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment


class SubcommentType(DjangoObjectType):
    class Meta:
        model = Subcomment


class CommentPaginatedType(graphene.ObjectType):
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    objects = graphene.List(CommentType)


class Query(graphene.ObjectType):
    tracks = graphene.List(TrackType, search=graphene.String(
    ), first=graphene.Int(), skip=graphene.Int())
    likes = graphene.List(LikeType)
    plays = graphene.List(PlayType)
    comments = graphene.Field(
        CommentPaginatedType, trackId=graphene.Int(), page=graphene.Int())
    subcomments = graphene.List(SubcommentType, commentId=graphene.Int())

    def resolve_tracks(self, info, search=None, first=None, skip=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(url__icontains=search) |
                Q(posted_by__username__icontains=search)
            )
            # starts with the texts starting with the search arg
            return Track.objects.filter(filter)

        return Track.objects.all()

    def resolve_likes(self, info):
        return Like.objects.all()

    def resolve_plays(self, info):
        return Play.objects.all()

    def resolve_comments(self, info, trackId, page):
        qs = Track.objects.get(
            id=trackId).comments.all().order_by('created_at').reverse()

        page_size = 5
        return get_paginator(qs, page_size, page, CommentPaginatedType)

    def resolve_subcomments(self, info, commentId):
        return Comment.objects.get(id=commentId).subcomments.all().order_by('created_at').reverse()


class CreateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()
        img_url = graphene.String()
        artist_name = graphene.String()

    def mutate(self, info, title, description, url, img_url, artist_name):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Login to add a track')

        track = Track(title=title, description=description, artist_name=artist_name,
                      url=url, posted_by=user, img_url=img_url)
        track.save()
        return CreateTrack(track=track)


class UpdateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()
        img_url = graphene.String()
        artist_name = graphene.String()

    def mutate(self, info, track_id, title, url, description, image_url, artist_name):
        user = info.context.user
        track = Track.objects.get(id=track_id)

        if track.posted_by != user:
            raise GraphQLError('Not permitted to update the track.')

        track.title = title
        track.description = description
        track.url = url
        track.image_url = image_url
        artist_name = artist_name

        track.save()

        return UpdateTrack(track=track)


class DeleteTrack(graphene.Mutation):
    track_id = graphene.Int()

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user
        track = Track.objects.get(id=track_id)

        if track.posted_by != user:
            raise GraphQLError('Not permitted to delete this track.')

        track.delete()

        return DeleteTrack(track_id=track_id)


class CreatePlay(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user

        if user.is_anonymous:
            user = None

        track = Track.objects.get(id=track_id)
        if not track:
            raise GraphQLError('Cannot find track with given track id')

        Play.objects.create(
            user=user,
            track=track
        )

        return CreatePlay(user=user, track=track)


class CreateLike(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Login to like tracks.')

        track = Track.objects.get(id=track_id)
        if not track:
            raise GraphQLError('Cannot find track with given track id')

        Like.objects.create(
            user=user,
            track=track
        )

        return CreateLike(user=user, track=track)


class DeleteLike(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user
        track = Track.objects.get(id=track_id)
        # import pdb; pdb.set_trace()
        like = Like.objects.filter(track=track, user=user)

        if user.is_anonymous:
            raise GraphQLError('Log in to unlike this track.')
        like.delete()

        return DeleteLike(user=user, track=track)


class CreateComment(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        comment = graphene.String()
        track_id = graphene.Int(required=True)

    def mutate(self, info, comment, track_id):
        user = info.context.user

        # import pdb; pdb.set_trace()
        track = Track.objects.get(id=track_id)

        if user.is_anonymous:
            raise GraphQLError('Login to comment')

        # import pdb; pdb.set_trace()

        Comment.objects.create(
            comment=comment,
            track=track,
            posted_by=user
        )

        return Comment(track=track)


class DeleteComment(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        comment_id = graphene.Int(required=True)

    def mutate(self, info, comment_id):
        user = info.context.user
        comment = Comment.objects.get(id=comment_id)

        if comment.posted_by != user:
            raise GraphQLError('Not permitted to delete this post')

        comment.delete()

        return DeleteComment(user=user)


class CreateSubcomment(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        subcomment = graphene.String()
        comment_id = graphene.Int(required=True)

    def mutate(self, info, subcomment, comment_id):
        user = info.context.user
        # import pdb; pdb.set_trace()
        comment = Comment.objects.get(id=comment_id)

        if user.is_anonymous:
            raise GraphQLError('Login to comment')

        Subcomment.objects.create(
            subcomment=subcomment,
            posted_by=user,
            comment=comment
        )

        return Subcomment(posted_by=user, comment=comment)


class DeleteSubcomment(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        subcomment_id = graphene.Int(required=True)

    def mutate(self, info, subcomment_id):
        user = info.context.user
        subcomment = Subcomment.objects.get(id=subcomment_id)

        if subcomment.posted_by != user:
            raise GraphQLError('Not permitted to delete this subcomment')
        subcomment.delete()

        return DeleteComment(user=user)


class UpdateProfile(graphene.Mutation):
    user_profile = graphene.Field(UserProfileType)

    class Arguments:
        avatar_url = graphene.String()

    def mutate(self, info, avatar_url):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Cannot edit profile')

        user_profile = UserProfile.objects.get(user_id=user.id)
        user_profile.avatar_url = avatar_url
        user_profile.save()
        # import pdb; pdb.set_trace()

        return UpdateProfile(user_profile=user_profile)


class Mutation(graphene.ObjectType):
    create_track = CreateTrack.Field()
    update_track = UpdateTrack.Field()
    delete_track = DeleteTrack.Field()
    create_like = CreateLike.Field()
    update_profile = UpdateProfile.Field()
    delete_like = DeleteLike.Field()
    create_comment = CreateComment.Field()
    delete_comment = DeleteComment.Field()
    create_subcomment = CreateSubcomment.Field()
    delete_subcomment = DeleteSubcomment.Field()
    create_play = CreatePlay.Field()
