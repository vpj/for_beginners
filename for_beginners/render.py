from IPython.core.display import display,HTML,Markdown
import random
import string
import json


def tensor_single(dimensions, end, options, css):
    dom_id = ''.join(random.choices(string.ascii_lowercase, k=10))
    dimensions = json.dumps(dimensions)
    end = json.dumps(end)
    options = json.dumps(options)
    #print(options)
    js = 'main.renderTensor("%s", %s, %s, %s);' % (dom_id, dimensions, end, options)
    js = 'require(["main"], function(main) { ' + js + ' });'

    return '<div id="%s" style="display=%s;"></div><script>%s</script>' % (dom_id, css, js)

def tensor(shape):
    mx = 0
    mn = 1e10
    last = -1

    for i, s in enumerate(shape):
        if s is not None and s.value is not None:
            mx = max(mx, s.value)
            mn = min(mn, s.value)
        else:
            last = i

    dimensions = []
    end = []
    options = {}
    MAX_SIZE = 10

    for s in shape:
        if s is not None and s.value is not None:
            if s.value <= 4:
                dimensions.append(s.value)
                end.append(None)
            else:
                d = max(2, round(((MAX_SIZE - 2) / mx) * s.value))
                dimensions.append(d)
                end.append(str(s.value))
        else:
            dimensions.append(MAX_SIZE - 2)
            end.append('?')


    #TODO
    if len(dimensions) > 3 or (last > -1 and last < len(dimensions) - 1:
        output = ''
        for i in range(len(dimensions) - 3):
            output += tensor_single(dimensions[i: i + 1], end[i: i + 1], {'highlight': [{'position': [0, 0], 'front': 'gray'}]}, 'inline-block')

        output += tensor_single(dimensions[-3:], end[-3:], {}, 'inline-block')
        return output
    else:
        return tensor_single(dimensions, end, {}, 'inline-block')


def html(string):
    display(HTML(string))

def latex(string):
    display(Markdown("\\begin{align}\n%s\n\\end{align}" % string))

def init():
    file = open("./js/main.js")
    display(HTML('<script>' + file.read() + '</script>'))

    file = open("./js/styles.css")
    display(HTML('<style>' + file.read() + '</style>'))


