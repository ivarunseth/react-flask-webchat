import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from celery import Celery

from .config import flask_config

# Flask extensions
db = SQLAlchemy()
socketio = SocketIO(cors_allowed_origins="*", engineio_logger=True)
celery = Celery(__name__,
                broker=os.environ.get('CELERY_BROKER_URL', 'redis://'),
                backend=os.environ.get('CELERY_RESULT_BACKEND', os.environ.get('CELERY_BROKER_URL', 'redis://')))
celery.config_from_object('api.celery_config')

# Import models so that they are registered with SQLAlchemy
from . import models  # noqa

# Import celery task so that it is registered with the Celery workers
from .tasks import run_flask_request  # noqa

# Import Socket.IO events so that they are registered with Flask-SocketIO
from . import events  # noqa


def create_app(config_name=None, main=True):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    app.config.from_object(flask_config[config_name])

    # Initialize flask extensions
    db.init_app(app)

    @app.cli.command('createdb')
    def createdb(): 
        """creates the database"""
        db.create_all()
    
    if main:
        # Initialize socketio server and attach it to the message queue, so
        # that everything works even when there are multiple servers or
        # additional processes such as Celery workers wanting to access
        # Socket.IO
        socketio.init_app(app,
                          message_queue=app.config['SOCKETIO_MESSAGE_QUEUE'])
    else:
        # Initialize socketio to emit events through through the message queue
        # Note that since Celery does not use eventlet, we have to be explicit
        # in setting the async mode to not use it.
        socketio.init_app(None,
                          message_queue=app.config['SOCKETIO_MESSAGE_QUEUE'],
                          async_mode='threading')
    celery.conf.update(flask_config[config_name].CELERY_CONFIG)

    # Register web application routes
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    # Register API routes
    from .blueprints import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')

    # Register async tasks support
    from .tasks import tasks_bp as tasks_blueprint
    app.register_blueprint(tasks_blueprint, url_prefix='/tasks')

    return app