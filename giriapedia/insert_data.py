# -*- coding: utf-8 -*-
"""
File to insert some datas in application
"""
from pymongo import MongoClient
from pycountry import subdivisions


CONNECTION = MongoClient().giriapedia

def include_country_and_states():

    hu3 = "BR"
    states_br = subdivisions.get(country_code=hu3)
    for state in states_br:
        new_code = state.code.split("-")[-1].lower()
        aux = {
            "code": new_code,
            "name": state.name
        }
        CONNECTION.states.insert(aux)

    return True


if __name__ == "__main__":
    include_country_and_states()
