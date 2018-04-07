class Node(object):
    def __init__(self, func, *args, **kwargs):
        #print(args)
        #print(kwargs)
        self.func = func
        self.args = args
        self.kwargs = kwargs
        self.name = None
        self.value = None
        self.scope = None

    def set_name(self, name):
        self.name = name
        self.kwargs['name'] = name

    def set_scope(self, scope):
        self.scope = ','.join(scope)

    def _mathSymbols(self, name):
        if name == 'epsilon':
            return '\\epsilon'
        elif name == "alpha":
            return '\\alpha'
        elif name == "beta":
            return "\\beta"
        else:
            return name

    def _renderName(self):
        parts = self.name.split("_")
        #print(parts)
        #for i in range(len(parts)):
        #    parts[i] = self._mathSymbols(parts[i])
        if len(parts) == 1:
            parts[0] = self._mathSymbols(parts[0])
        sub = ''
        for i in range(1, len(parts)):
            sub += parts[i].capitalize()
        if len(parts) > 1:
            return "%s%s" % (parts[0], sub)
        else:
            return parts[0]

    def _renderArg(self, idx, scope):
        if isinstance(self.args[idx], Node):
            return self.args[idx].render(scope)
        else:
            return self.args[idx]

    def renderFormula(self):
        #TODO
        pass

    def renderTensor(self):
        pass

    def render_formula(self, scope):
        return "UNIMPLEMENTED"

    def render_assign(self, scope):
        return self._renderName()

    def render(self, scope, is_inner=True):
        if is_inner and scope == self.scope and self.name is not None:
            return self._renderName()
        else:
            if is_inner:
                return self.render_formula(scope)
            else:
                return self.render_assign(scope) + ' = ' + self.render_formula(scope)

    def create(self):
        args = []
        for arg in self.args:
            if isinstance(arg, Node):
                if arg.value is None:
                    arg.create()
                args.append(arg.value)
            else:
                args.append(arg)
        self.value = self.func(*args, **self.kwargs)
        return self.value


