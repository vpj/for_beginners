from .node import Node
import tensorflow as tf
import sys

class Add(Node):
    def render_formula(self, scope):
        return "%s + %s" % (self._renderArg(0, scope), self._renderArg(1, scope))

def add(*args, **kwargs):
    return Add(tf.add, *args, **kwargs)


class ReduceSum(Node):
    def _get_axis(self):
        axis = self.kwargs['axis']
        if axis < 0:
            axis = len(self.args[0].value.shape) + axis
        return axis

    def _get_index(self, axis, counter):
        index = ''
        for i in range(len(self.args[0].value.shape)):
            if i > 0:
                index += ','
            if i == axis:
                index += counter
            else:
                index += ':'

        return index


    def render_formula(self, scope):
        axis = self._get_axis()
        index = self._get_index(axis, 'i')
        return "\sum_{i=0}^{%d} {%s_{%s}}" % (self.args[0].value.shape[axis].value - 1, self._renderArg(0, scope), index)

    def render_assign(self, scope):
        axis = self._get_axis()
        index = self._get_index(axis, '1')
        return "%s_{%s}" % (self._renderName(), index)

def reduce_sum(*args, **kwargs):
    return ReduceSum(tf.reduce_sum, *args, **kwargs)



class Square(Node):
    def render_formula(self, scope):
        return "%s^2" % (self._renderArg(0, scope))

def square(*args, **kwargs):
    return Square(tf.square, *args, **kwargs)



class Sqrt(Node):
    def render_formula(self, scope):
        return "\\sqrt{%s}" % (self._renderArg(0, scope))

def sqrt(*args, **kwargs):
    return Sqrt(tf.sqrt, *args, **kwargs)



class Divide(Node):
    def render_formula(self, scope):
        return "\\frac{%s}{%s}" % (self._renderArg(0, scope), self._renderArg(1, scope))

def divide(*args, **kwargs):
    return Divide(tf.divide, *args, **kwargs)



class Multiply(Node):
    def render_formula(self, scope):
        return "{%s} * {%s}" % (self._renderArg(0, scope), self._renderArg(1, scope))

def multiply(*args, **kwargs):
    return Multiply(tf.multiply, *args, **kwargs)



exports = {
    'add': add,
    'reduce_sum': reduce_sum,
    'square': square,
    'sqrt': sqrt,
    'divide': divide,
    'multiply': multiply
}

sys.modules[__name__] = exports

