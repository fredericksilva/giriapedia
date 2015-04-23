# Giriapédia

Repositorio do projeto Giriapédia.

# README WIP

# Intro

Essa ideia nasceu quando começei a programar com Web, em 2012. Na época, criei um app que se chamava de Pintapedia, que "resolvia" uma parte do problema que o
Giriapédia resolve. Nesse tempo, só eram cadastradas pelos usuários, as girias usadas por "pintas" aqui do meu estado, Rio Grande do Norte.

### Pinta
[Exemplo](https://www.dropbox.com/s/w9spa211b2nsw4t/Captura%20de%20tela%202015-04-23%2019.58.29.png?dl=0)

# Giriapédia

Pois bem, em resumo, o Giriapédia é uma plataforma colaborativa, onde os usuários poderão cadastrar girias e seus significados em cada estado.

# Tecnologias

0 - Tasks
  * [Gulp](http://gulpjs.com/)

1 - Angular.js:
  * [ui-route](https://angular-ui.github.io/ui-router/)
  * [Angular Storage](https://github.com/auth0/angular-storage)
  * [Angular JWT](https://github.com/auth0/angular-jwt)

2 - Pyramid
  * [Pyramid-Mako](https://github.com/Pylons/pyramid_mako)

3 - MongoDB
  * [Pyramid Mongoengine](https://github.com/marioidival/pyramid_mongoengine)

# Contribuindo

Fork o projeto:)

Para rodar o projeto em sua maquina, primeiramente crie uma env (com seu gerenciador preferido):

    virtualenv giriapedia
    source giriapedia/bin/activate

    # Ou virtualenvwrapper

    mkvirtualenv giriapedia
    workon giriapedia

Instale as dependencias - Python:

    pip install -r requirements.txt

Como este projeto usa o gulp para fazer alguns trabalhos de assets, é necessario o uso do node.js.

Dentro da pasta também rode:

    npm install


## Executando tasks e o server.

Para rodar o server:

    pserver development --reload


Para rodar gulp _(detalhes no arquivo gulpfile.js)_:

    gulp
