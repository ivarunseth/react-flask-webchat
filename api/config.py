import os


class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.environ.get('SECRET_KEY', '51f52814-0071-11e6-a247-000ec6c2372c')
    SERVER_NAME = os.environ.get("SERVER_NAME", "127.0.0.1:5000")
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///db.sqlite3')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    REQUEST_STATS_WINDOW = 15
    CELERY_CONFIG = {}
    SOCKETIO_MESSAGE_QUEUE = os.environ.get(
        'SOCKETIO_MESSAGE_QUEUE', os.environ.get('CELERY_BROKER_URL',
                                                 'redis://'))


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    pass


class TestingConfig(Config):
    TESTING = True
    SERVER_NAME = 'localhost'
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
    CELERY_CONFIG = {'task_always_eager': True}
    SOCKETIO_MESSAGE_QUEUE = None


flask_config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}