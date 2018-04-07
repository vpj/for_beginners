from .node import Node
import tensorflow as tf
import sys

class Conv2D(Node):
    def render_formula(self, scope):
        return "\mathrm{conv2d}(%s)" % (self._renderArg(0, scope))

def conv2d(*args, **kwargs):
    return Conv2D(tf.layers.conv2d, *args, **kwargs)

exports = {
    'conv2d': conv2d
}

sys.modules[__name__] = exports

