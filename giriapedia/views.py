# -*- coding: utf8 -*-
from pyramid.view import view_config, view_defaults
from .models import State, Giria, User

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

    @view_config(request_method="GET")
    def collection(self):
        if self.current_state:
            state = State.objects(code=self.current_state).first()
            girias = Giria.objects(state=state).all()
            return girias
        return Giria.objects.all()

    @view_config(request_method="POST")
    def create(self):
        return {'success': True}


@view_defaults(route_name="girias:items", renderer="json")
class GiriaItemView(object):

    def __init__(self, request):
        self.req = request
        self.giria_id = self.req.matchdict['giria_id']

    @view_config(request_method="GET")
    def get_giria(self):
        return {}

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
