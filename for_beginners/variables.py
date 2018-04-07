from .node import Node
import tensorflow as tf
import sys

class Variable(Node):
    def render(self, scope, is_inner=True):
        return self._renderName()

def constant(*args, **kwargs):
    return Variable(tf.constant, *args, **kwargs)

def placeholder(*args, **kwargs):
    return Variable(tf.placeholder, *args, **kwargs)

exports = {
    'constant': constant,
    'placeholder': placeholder
}

sys.modules[__name__] = exports

