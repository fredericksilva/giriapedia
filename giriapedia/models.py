from pyramid_mongoengine import MongoEngine
from passlib.hash import sha256_crypt


db = MongoEngine()


class User(db.Document):
    meta = {"collection": "users"}

    username = db.StringField(unique=True)
    password = db.StringField(required=True)
    name = db.StringField(max_length=40)

    def clean(self):
        if self.password:
            self.password = sha256_crypt.encrypt(self.password)

    def verify_password(self, unhashed):
        if unhashed:
            return sha256_crypt.verify(unhashed, self.password)


class State(db.Document):
    meta = {"collection": "states"}

    code = db.StringField()
    name = db.StringField()


class GiriaDescription(db.EmbeddedDocument):

    description = db.StringField(max_length=2000)
    votes = db.LongField(default=0)


class Giria(db.Document):
    meta = {"collection": "girias"}

    giria = db.StringField(required=True, unique_with="state")
    description = db.ListField(
        db.EmbeddedDocumentField(GiriaDescription)
    )
    state = db.ReferenceField(State)
    user = db.ReferenceField(User)


class Comment(db.EmbeddedDocument):

    comment = db.StringField(max_length=1000)
    user = db.ReferenceField(User)
    giria = db.ReferenceField(Giria)
