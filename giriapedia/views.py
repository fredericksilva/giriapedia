from pyramid.view import view_config, view_defaults
from .models import State


@view_config(route_name='home', renderer='templates/main.html')
def my_view(request):
    """View que retorna somente a pagina inicial"""
    return {}

@view_config(route_name='estado', renderer='templates/index.html')
def estado_page(request):
    """Retorna pagina para renderizar `Girias` do `Estado` atual"""
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

    @view_config(request_method="GET")
    def collection(self):
        return {}

    @view_config(request_method="POST")
    def create(self):
        return {}


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
