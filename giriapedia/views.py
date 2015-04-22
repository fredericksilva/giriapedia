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
    """Retorna uma lista de codigos dos estados brasileiros, juntamente com uma
    URL estatica, para ser usada com angular.js"""
    gif_static = request.static_url('giriapedia:static/img/null.gif')
    estados = [{"code":state.code, "static": gif_static}
                for state in State.objects.all()]
    return estados


@view_defaults(route_name="girias:collection", renderer="json")
class GiriaCollectionView(object):
    """
    View que tem responsabilidade de criar e retornar girias.
    Respondem apenas a GET e POST.
    """

    def __init__(self, request):
        self.req = request
        self.current_state = self.req.params.get('state')
        auth = self.req.headers.get("Authorization")
        self.token = auth.split(" ")[1] if auth else None

    @view_config(request_method="GET")
    def collection(self):
        """Retorna uma lista de todas as girias. Se for passado por parametro um
        estado, retorna todas as girias desse estado."""
        if self.current_state:
            state = State.objects(code=self.current_state).first()
            girias = Giria.objects(state=state).all()
            if not girias:
                return None
            return girias
        return Giria.objects.all()


    @view_config(request_method="POST")
    def create(self):
        """View responsavel por criar a giria. Se existir uma giria cadastrada
        para esse estado, retorna um error para o front-end."""
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
    """View responsavel por responder a uma giria espeficia"""

    def __init__(self, request):
        self.req = request
        self.giria = self.req.matchdict['giria'].lower()
        self.state = self.req.matchdict['state']
        auth = self.req.headers.get("Authorization")
        self.token = auth.split(" ")[1] if auth else None

    @view_config(request_method="GET")
    def get_giria(self):
        """Retorna uma giria espeficia. por `state` e `giria`"""
        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()

        if giria:
            return giria
        return exception_response(404)

    @view_config(request_method="PUT")
    def update_giria(self):
        """View para atualizar uma giria. Porém é apenas usada para adicionar
        novos significados para uma determinada giria - passada por parametro."""
        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()

        # Salvando sem verificar descrição
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
        """View responsavel pelo upvotes de um significado.
        + 1 nos votos e adiciona o token do usuario em uma lista, onde existem
        usuarios que ja votaram nesse significado."""
        indice = self.req.json['description']

        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()

        if giria:

            giria.description[indice].votes['votes'] += 1
            giria.description[indice].votes['users'].append(self.token)
            giria.save()

            self.sort_description(giria)

            return {"success": True, "giria": giria}
        return {}

    @view_config(request_method="PUT", request_param="downvotes=true")
    def send_downvote(self):
        """View responsavel pelo upvotes de um significado.
        - 1 nos votos e adiciona o token do usuario em uma lista, onde existem
        usuarios que ja votaram nesse significado."""
        indice = self.req.json['description']

        state = State.objects(code=self.state).first()
        giria = Giria.objects(state=state, giria=self.giria).first()

        if giria:

            giria.description[indice].votes['votes'] -= 1
            giria.description[indice].votes['users'].append(self.token)
            giria.save()

            self.sort_description(giria)

            return {"success": True, "giria": giria}
        return {}

    def sort_description(self, giria):
        """Ordena os significados por votos"""
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
    """Metodo usado para formatar o novo significado na collection de girias.
    descriptions = {
    'users': [lista de usuarios]
    'votes': 9999
    }
    """

    descriptions = GiriaDescription(
        description=giria_info["description"],
        votes={"users": set(), "votes": 0}
    )

    return descriptions


def encode_token(req, payload):
    """Metodo usado para criar o token jwt. recebe um request e o payload com
    informações do usuario. Por segurança, é removido a key `password`."""
    del payload["password"]
    return jwt.encode(payload, req.registry.settings.get("giriasecret", "galado"))


def decode_token(req, jwt_str):
    """Metodo usado para decodificar o token jwt. recebe um request e o token do
    usuario."""
    return jwt.decode(jwt_str, req.settings.get("giriasecret", "galado"))


@view_config(route_name="signin", request_method="POST", renderer="json")
def signin(request):
    """View para criar novo usuario no sistema."""
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
    """View usada para login no sistema. Retorna o token do usuario, se ele
    existir."""
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
