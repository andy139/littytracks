import graphene
from django.contrib.auth.models import User
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from .models import Track, Like, Play, UserProfile, Comment, Subcomment, PlayCount
from users.schema import UserType
from django.db.models import Q
from .utils import get_paginator
from itertools import chain


class TrackType(DjangoObjectType):
    class Meta:
        model = Track


class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile


class LikeType(DjangoObjectType):
    class Meta:
        model = Like


class PlayCountType(DjangoObjectType):
    class Meta:
        model = PlayCount


# class PlayType(DjangoObjectType):
#     class Meta:
#         model = Play


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment


class SubcommentType(DjangoObjectType):
    class Meta:
        model = Subcomment


class CorpusType(graphene.ObjectType):
    # List type that returns list of strings
    corpus = graphene.List(graphene.String)
    


class TrackPaginatedType(graphene.ObjectType):
    page = graphene.Int()
    pages = graphene.Int()
    has_next = graphene.Boolean()
    has_prev = graphene.Boolean()
    objects = graphene.List(TrackType)


class Query(graphene.ObjectType):
    tracks = graphene.List(TrackType, search=graphene.String(
    ), first=graphene.Int(), skip=graphene.Int())
    likes = graphene.List(LikeType)

    # Return a list of search terms
    corpus = graphene.Field(CorpusType)

    # plays = graphene.List(PlayType)
    comments = graphene.List(
        CommentType, trackId=graphene.Int(), page=graphene.Int(), offset=graphene.Int(), limit=graphene.Int())
    subcomments = graphene.List(SubcommentType, commentId=graphene.Int())
    pagination = graphene.Field(TrackPaginatedType, page=graphene.Int())

    def resolve_tracks(self, info, search=None, first=None, skip=None):
        if search:
            filter = (
                Q(title__icontains=search) |
                Q(posted_by__username__icontains=search) |
                Q(artist_name__icontains=search)
            )
            return Track.objects.filter(filter).order_by('created_at').reverse()

        return Track.objects.all().order_by('created_at').reverse()

    def resolve_corpus(self, info):
    
        tracks = Track.objects.all()
        users = User.objects.all()
        titles = tracks.values_list('title', flat=True)
        artist_names = tracks.values_list('artist_name', flat=True)
        user_names = users.values_list('username', flat=True)

        result_list = list(chain(titles, artist_names, user_names))


        return CorpusType(corpus = result_list)

    def resolve_pagination(self, info, page):
        page_size = 4
        qs = Track.objects.all().order_by('created_at').reverse()
        return get_paginator(qs, page_size, page, TrackPaginatedType)

    def resolve_likes(self, info):
        return Like.objects.all()

    # def resolve_plays(self, info):
    #     return Play.objects.all()

    def resolve_comments(self, info, trackId, limit, offset):
        qs = Track.objects.get(
            id=trackId).comments.all().order_by('created_at').reverse()

        if offset:
            qs = qs[offset:]
        if limit:
            qs = qs[:limit]

        return qs

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

        playcount = PlayCount.objects.create(
            track=track,
            play_count=0
        )

        playcount.save()

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

    def mutate(self, info, track_id, title, url, description, img_url, artist_name):
        user = info.context.user
        track = Track.objects.get(id=track_id)

        if track.posted_by != user:
            raise GraphQLError('Not permitted to update the track.')

        track.title = title
        track.description = description
        track.url = url
        track.img_url = img_url
        track.artist_name = artist_name

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


class AddPlayCount(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Login to play')

        track = Track.objects.get(id=track_id)
        if not track:
            raise GraphQLError('Cannot find track with given track id')

        if not PlayCount.objects.filter(track=track).exists():
            PlayCount.objects.create(
                track=track,
                play_count=0
            )
        else:
            # This will increase playcount by one
            import pdb

            PlayCountObj = PlayCount.objects.get(track=track)
            playcount = PlayCountObj.play_count
            PlayCountObj.play_count = playcount + 1

            # pdb.set_trace()

            PlayCountObj.save()

        return AddPlayCount(track=track)


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
    comment = graphene.Field(CommentType)
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

        new_comment = Comment(comment=comment,
                              track=track,
                              posted_by=user
                              )

        new_comment.save()

        return CreateComment(track=track, comment=new_comment)


class DeleteComment(graphene.Mutation):
    user = graphene.Field(UserType)
    track = graphene.Field(TrackType)
    comment_id = graphene.Int()

    class Arguments:
        comment_id = graphene.Int(required=True)

    def mutate(self, info, comment_id):
        user = info.context.user
        comment = Comment.objects.get(id=comment_id)

        if comment.posted_by != user:
            raise GraphQLError('Not permitted to delete this post')

        comment.delete()

        return DeleteComment(comment_id=comment_id)


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


class UpdateBackground(graphene.Mutation):
    user_profile = graphene.Field(UserProfileType)

    class Arguments:

        background_url = graphene.String()

    def mutate(self, info, background_url):
        user = info.context.user

        if user.is_anonymous:
            raise GraphQLError('Cannot edit profile')

        user_profile = UserProfile.objects.get(user_id=user.id)

        user_profile.background_url = background_url

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
    update_background = UpdateBackground.Field()
    add_playcount = AddPlayCount.Field()
