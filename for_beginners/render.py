from IPython.core.display import display,HTML,Markdown
import random
import string
import json

def diagram_tensor(shape):
    dom_id = ''.join(random.choices(string.ascii_lowercase, k=10))
    without_none = []
    for s in shape:
        if s is not None and str(s) != '?':
            without_none.append(str(s))

    js = 'main.renderTensor("%s", [%s]);' % (dom_id, ', '.join(without_none))
    js = 'require(["main"], function(main) { ' + js + ' });'

    display(HTML('<div id="%s"></div><script>%s</script>' % (dom_id, js)))

def diagram_tensor_new(dimensions, end, options):
    dimensions = json.dumps(dimensions)
    end = json.dumps(end)
    options = json.dumps(options)
    js = 'main.renderTensor("%s", %s, %s, %s);' % (dom_id, dimensions, end, options)
    js = 'require(["main"], function(main) { ' + js + ' });'

    display(HTML('<div id="%s"></div><script>%s</script>' % (dom_id, js)))

def latex(string):
    display(Markdown("\\begin{align}\n%s\n\\end{align}" % string))

def init():
    file = open("./js/main.js")
    display(HTML('<script>' + file.read() + '</script>'))

    file = open("./js/styles.css")
    display(HTML('<style>' + file.read() + '</style>'))


