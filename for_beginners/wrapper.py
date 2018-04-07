from types import ModuleType

class Wrapper(object):
    def __init__(self, obj, name):
        self._name = name
        self._obj = obj

    def __getattr__(self, name):
        if name in self.__dict__:
            return self.__dict__[name]

        obj = self.__dict__['_obj']
        if type(obj) is dict:
            return obj[name]
        else:
        #elif isinstance(obj, ModuleType):
            return getattr(obj, name)



def add_dictionary(wrapper, dictionary):
    for key, value in dictionary.items():
        setattr(wrapper, key, value)
