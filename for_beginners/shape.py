from .node import Node
import tensorflow as tf
import sys

class Reshape(Node):
    def render_formula(self, scope):
        return "\mathrm{reshape}(%s)" % (self._renderArg(0, scope))

def reshape(*args, **kwargs):
    return Reshape(tf.reshape, *args, **kwargs)

exports = {
    'reshape': reshape
}

sys.modules[__name__] = exports

