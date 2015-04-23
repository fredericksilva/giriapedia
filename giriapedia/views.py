# -*- coding: utf8 -*-
from pyramid.view import view_config, view_defaults
from pyramid.httpexceptions import exception_response
from .models import *

import jwt


@view_config(route_name='home', renderer='templates/main.html')
def my_view(request):
    """View return start page"""
    return {}


@view_config(route_name="estados", renderer="json")
def states(request):
    """Return list with brazilian state code, together an URL static for
    angular.js """
    gif_static = request.static_url('giriapedia:static/img/null.gif')
    list_state = [
        {"code":state.code, "static": gif_static}
        for state in State.objects.all()
    ]
    return list_state


@view_defaults(route_name="girias:collection", renderer="json")
class GiriaCollectionView(object):
    """
    View handler to GET and POST request, create and return `giria`
    """

    def __init__(self, request):
        self.req = request
        self.current_state = self.req.params.get('state')
        auth = self.req.headers.get("Authorization")
        self.token = auth.split(" ")[1] if auth else None

    @view_config(request_method="GET")
    def collection(self):
        """ Return list with all `girias`. If exists `current_state`, return all
        `girias` from that `current_state`"""
        if self.current_state:
            state = State.objects(code=self.current_state).first()
            girias = Giria.objects(state=state).all()
            if not girias:
                return None
            return girias
        return Giria.objects.all()

    @view_config(request_method="POST")
    def create(self):
        """View used to create a `giria`. If `giria` exists to `current_state`,
        return an error to frontend."""

        giria = self.req.json
        state = State.objects(code=giria["state"]).first()
        user = User.objects(token=self.token).first()

        if Giria.objects(giria=giria['giria'].lower(), state=state).first():
            return {"success": False, "error": "Já existe essa giria cadastrada"}

        new_giria = Giria()
        new_giria.giria = giria["giria"].lower()
        new_giria.state = state
        new_giria.user = user

        new_giria.description.append(
            prepare_user_description(giria)
        )
        new_giria.save()

        return {'success': True}


@view_defaults(route_name="girias:items", renderer="json")
class GiriaItemView(object):
    """View handler to specific `giria`."""

    def __init__(self, request):
        self.req = request
        self.giria = self.req.matchdict['giria'].lower()
        self.state = self.req.matchdict['state']
        auth = self.req.headers.get("Authorization")
        self.token = auth.split(" ")[1] if auth else None

    @view_config(request_method="GET")
    def get_giria(self):
        """Return `giria` instance specific, by `state` and `giria` argument"""
        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()

        if giria:
            return giria
        return exception_response(404)

    @view_config(request_method="PUT")
    def update_giria(self):
        """View to update `giria`. So this it's only used to add a new
        `description` for a certain `giria`.  """
        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()

        # Save a `giria` without verification
        if giria:
            giria.description.append(
                prepare_user_description(self.req.json)
            )
            giria.save()

            self.sort_description(giria)
            return {"success": True}

        return exception_response(404)

    @view_config(request_method="PUT", request_param="upvotes=true")
    def send_upvote(self):
        """View handler to save upvotes from `description`.
        + 1 in `votes` and add user `token` a list `users`, where have only users
        that votes it."""
        index_ = self.req.json['description']

        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()

        if giria:

            giria.description[index_].votes['votes'] += 1
            giria.description[index_].votes['users'].append(self.token)
            giria.save()

            self.sort_description(giria)
            return {"success": True, "giria": giria}
        return {}

    @view_config(request_method="PUT", request_param="downvotes=true")
    def send_downvote(self):
        """View handler to save downvotes from `description`.
        - 1 in `votes` and add user `token` a list `users`, where have only users
        that votes it."""
        index_ = self.req.json['description']

        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()

        if giria:

            giria.description[index_].votes['votes'] -= 1
            giria.description[index_].votes['users'].append(self.token)
            giria.save()

            self.sort_description(giria)
            return {"success": True, "giria": giria}
        return {}

    def sort_description(self, giria):
        """Sort `descriptions` by `votes`"""
        giria.description = sorted(
            giria.description,
            key=lambda g: g.votes['votes'],
            reverse=True
        )
        giria.save()

    @view_config(request_method="DELETE")
    def delete_giria(self):
        return {}


def prepare_user_description(giria_info):
    """Method used to format a new `description` in collection of `girias`.
    descriptions = {
        'users': [list of users-token]
        'votes': 9999
    }
    """
    descriptions = GiriaDescription(
        description=giria_info["description"],
        votes={"users": set(), "votes": 0}
    )

    return descriptions


def encode_token(req, payload):
    """Method used to create the `token`. Receive request and the payload with
    user info. By security, `password` key is removed from payload."""
    del payload["password"]
    return jwt.encode(payload, req.registry.settings.get("giriasecret", "galado"))


def decode_token(req, jwt_str):
    """Method used to decode the `token` JWT. Receive request and token jwt."""
    return jwt.decode(jwt_str, req.settings.get("giriasecret", "galado"))


@view_config(route_name="signin", request_method="POST", renderer="json")
def signin(request):
    """View used to create a user to system"""
    user_payload = request.json

    if User.objects(username=user_payload["username"]).first():
        return {"success": False, "error": "Este usuario ja esta cadastrado."}

    token_payload = user_payload.copy()
    token = jwt.encode(
        token_payload,
        encode_token(request, token_payload)
    )

    user_payload["token"] = token
    new_user = User(**user_payload)
    new_user.save()

    return {"success": True, "token": token}


@view_config(route_name="login", request_method="POST", renderer="json")
def login(request):
    """View used to login. Return a `token` of user logged, if exists"""
    user = User.objects(username=request.json.get("username")).first()

    if not user or not user.verify_password(request.json.get("password")):
        return {
            "success": False,
            "error": "Usuario não cadastrado ou Senha incorreta"
        }

    return {"success": True, "token": user.token}


@view_config(route_name="logout", request_method="POST", renderer="json")
def logout(request):
    pass
