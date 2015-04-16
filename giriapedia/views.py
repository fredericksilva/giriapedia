# -*- coding: utf8 -*-
from pyramid.view import view_config, view_defaults
from pyramid.httpexceptions import exception_response
from .models import *

import jwt


@view_config(route_name='home', renderer='templates/main.html')
def my_view(request):
    """View que retorna somente a pagina inicial"""
    return {}


@view_config(route_name="estados", renderer="json")
def estados(request):
    gif_static = request.static_url('giriapedia:static/img/null.gif')
    estados = [{"code":state.code, "static": gif_static}
                for state in State.objects.all()]
    return estados


@view_defaults(route_name="girias:collection", renderer="json")
class GiriaCollectionView(object):

    def __init__(self, request):
        self.req = request
        self.current_state = self.req.params.get('state')
        auth = self.req.headers.get("Authorization")
        self.token = auth.split(" ")[1] if auth else None

    @view_config(request_method="GET")
    def collection(self):
        if self.current_state:
            state = State.objects(code=self.current_state).first()
            girias = Giria.objects(state=state).all()
            if not girias:
                return None
            return girias
        return Giria.objects.all()

    @view_config(request_method="POST")
    def create(self):
        giria = self.req.json

        state = State.objects(code=giria["state"]).first()
        user = User.objects(token=self.token).first()

        new_giria = Giria()
        new_giria.giria = giria["giria"]
        new_giria.state = state
        new_giria.user = user

        descriptions = GiriaDescription(description=giria["description"])
        new_giria.description.append(descriptions)

        # Vericar se existe esta giria cadastrada com esse estado
        # Se existir, redireciona para a giria ja cadastrada e pede para criar
        # uma outra descrição
        try:
            new_giria.save()
        except:
            pass

        return {'success': True}


@view_defaults(route_name="girias:items", renderer="json")
class GiriaItemView(object):

    def __init__(self, request):
        self.req = request
        self.giria = self.req.matchdict['giria']
        self.state = self.req.matchdict['state']

    @view_config(request_method="GET")
    def get_giria(self):
        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()
        if giria:
            return giria
        return exception_response(404)

    @view_config(request_method="PUT")
    def update_giria(self):
        return {}

    @view_config(request_method="DELETE")
    def delete_giria(self):
        return {}


def encode_token(req, payload):
    del payload["password"]
    return jwt.encode(payload, req.settings.get("giriasecret", "galado"))


def decode_token(req, jwt_str):
    return jwt.decode(jwt_str, req.settings.get("giriasecret", "galado"))


@view_config(route_name="signin", request_method="POST", renderer="json")
def signin(request):
    """View to create new user in system"""
    user_payload = request.json

    if User.objects(username=user_payload["username"]).first():
        return {"success": False, "error": "Este usuario ja esta cadastrado."}

    token = jwt.encode(
        user_payload,
        encode_token(user_payload)
    )

    user_payload["token"] = token
    new_user = User(**user_payload)
    new_user.save()

    return {"success": True, "token": token}


@view_config(route_name="login", request_method="POST", renderer="json")
def login(request):
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
