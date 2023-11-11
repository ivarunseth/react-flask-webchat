import eventlet
eventlet.monkey_patch()

from api import create_app

# Create an application instance that web servers can use. We store it as
# "application" (the wsgi default) and also the much shorter and convenient
# "app".
application = app = create_app(main=False)