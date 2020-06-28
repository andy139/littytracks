from django.contrib.auth import get_user_model
import graphene
from graphene_django import DjangoObjectType
from tracks.models import UserProfile
from graphql import GraphQLError
from django.core.exceptions import ValidationError


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()
        # only_fields = ('id', 'email', 'password', 'username')

class UserProfileType(DjangoObjectType):
    class Meta:
        model = UserProfile

class Query(graphene.ObjectType):
    user = graphene.Field(UserType, id=graphene.Int(
        required=True
    ))

    me = graphene.Field(UserType)

    def resolve_user(self, info, id):
        # import pdb; pdb.set_trace()

        return get_user_model().objects.get(id=id)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('Not logged in')

        return user

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)
   
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String(required=True)
    
    def mutate(self, info, username, password, email):
        errors = []

        if get_user_model().objects.filter(email=email).exists():
            errors.append('Email is already registered')
            raise GraphQLError('Email is already registered')

        if get_user_model().objects.filter(username=username).exists():
            errors.append('Username is already registered')
            raise GraphQLError('Username is already registered')
           

        if len(errors) == 0:
            try:
                user = get_user_model()(
                    username=username,
                    email=email
                )
                user.set_password(password)
                user.save()

                user_profile = UserProfile(user=user)
                user_profile.avatar_url = 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4'
                user_profile.save()
                return CreateUser(user=user)
            except ValidationError as e:
                return CreateUser(errors=[e])

        # import pdb; pdb.set_trace()
        return CreateUser(errors=errors)

        




class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
