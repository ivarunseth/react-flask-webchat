import os

import eventlet
eventlet.monkey_patch(os=False)

from api import create_app, socketio

# Create an application instance that web servers can use. We store it as
# "application" (the wsgi default) and also the much shorter and convenient
# "app".
application = app = create_app(os.environ.get('FLASK_ENV', 'production'))


if __name__ == '__main__':
    from api.main import before_first_request
    with app.app_context():
        before_first_request()
    socketio.run(app, log_output=True)