from . import render

class Model(object):
    def __init__(self):
        self.__dict__['name'] = "Model"
        self.__dict__['_scope'] = []

    def add_scope(self, name):
        self._scope.append(name)

    def remove_scope(self):
        del self._scope[-1]

    def __setattr__(self, name, value):
        #print("%s = %s" % (name, str(value)))
        value.set_name(name)
        value.set_scope(self._scope)
        p = value.create()
        #print(value.scope)
        if len(self._scope) == 0:
            render.latex(value.render(value.scope, False))
            render.diagram_tensor(p.shape)

        #print("%s = %s, shape %s: %s" % (name, str(p.name), p.shape, str(p)))
        self.__dict__[name] = value

