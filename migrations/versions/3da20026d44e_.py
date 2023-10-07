"""empty message

Revision ID: 3da20026d44e
Revises: 
Create Date: 2023-10-08 00:38:57.640003

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3da20026d44e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.Integer(), nullable=True),
    sa.Column('updated_at', sa.Integer(), nullable=True),
    sa.Column('last_seen_at', sa.Integer(), nullable=True),
    sa.Column('nickname', sa.String(length=32), nullable=False),
    sa.Column('password_hash', sa.String(length=256), nullable=False),
    sa.Column('token', sa.String(length=64), nullable=True),
    sa.Column('online', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('nickname'),
    sa.UniqueConstraint('token')
    )
    op.create_table('messages',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.Integer(), nullable=True),
    sa.Column('updated_at', sa.Integer(), nullable=True),
    sa.Column('source', sa.Text(), nullable=False),
    sa.Column('html', sa.Text(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('messages')
    op.drop_table('users')
    # ### end Alembic commands ###
