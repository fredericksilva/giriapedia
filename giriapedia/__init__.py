from pyramid.config import Configurator


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.include("pyramid_mako")
    config.include("pyramid_mongoengine")
    config.add_static_view("static", "static", cache_max_age=3600)

    # own config's

    config.add_mako_renderer(".html")
    config.add_connection_database()

    # routes

    config.add_route('home', '/')
    config.add_route('estado', '/g/{state}/')
    config.add_route('estados', '/estados/')
    config.add_route('girias:collection', '/girias/')
    config.add_route('girias:items', '/girias/{giria_id}/')
    config.scan()

    return config.make_wsgi_app()
