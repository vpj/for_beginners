import tensorflow
from .node import Node
from .model import Model
from .wrapper import Wrapper, add_dictionary
from .render import init as init_render
import sys

#tf.tile
#tf.get_variable
#tf.reshape
#tf.matmul
#tf.softmax formula
#tf.argmax


tf = Wrapper(tensorflow, 'tf')
from . import arithmetic
add_dictionary(tf, arithmetic)
from . import variables
add_dictionary(tf, variables)
from . import shape
add_dictionary(tf, shape)

tf.nn = Wrapper(tensorflow.nn, 'tf.nn')
tf.nn.relu = tensorflow.nn.relu

tf.layers = Wrapper(tensorflow.layers, 'tf.layers')
from . import layers
add_dictionary(tf.layers, layers)

init_render()

sys.modules[__name__] = tf
