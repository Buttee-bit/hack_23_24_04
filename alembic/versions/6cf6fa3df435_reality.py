"""Reality

Revision ID: 6cf6fa3df435
Revises: 043f7d4bb0e6
Create Date: 2024-03-23 13:39:59.135775

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6cf6fa3df435'
down_revision = '043f7d4bb0e6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('reality_data',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('point_x', sa.Float(), nullable=True),
    sa.Column('point_y', sa.Float(), nullable=True),
    sa.Column('main_type', sa.String(), nullable=True),
    sa.Column('segment_type', sa.String(), nullable=True),
    sa.Column('entity_type', sa.String(), nullable=True),
    sa.Column('total_arena', sa.Integer(), nullable=True),
    sa.Column('floor', sa.Integer(), nullable=True),
    sa.Column('lease_price', sa.Integer(), nullable=True),
    sa.Column('additional_info', sa.String(), nullable=True),
    sa.Column('source_info', sa.String(), nullable=True),
    sa.Column('address', sa.String(), nullable=True),
    sa.Column('update_date', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_reality_data'))
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('reality_data')
    # ### end Alembic commands ###
