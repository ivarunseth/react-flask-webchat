# global Celery options that apply to all configurations

# enable the pickle serializer
task_serializer = 'pickle'
result_serializer = 'pickle'
accept_content = ['pickle']
broker_connection_retry_on_startup = True