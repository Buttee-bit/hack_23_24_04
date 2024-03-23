"""init_

Revision ID: 043f7d4bb0e6
Revises: 
Create Date: 2024-03-23 11:46:08.273893

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '043f7d4bb0e6'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('poi_data',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('adress_name', sa.String(), nullable=True),
    sa.Column('addres_comment', sa.String(), nullable=True),
    sa.Column('lon', sa.Float(), nullable=True),
    sa.Column('lat', sa.Float(), nullable=True),
    sa.Column('rubrics', postgresql.ARRAY(sa.String()), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_poi_data'))
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('poi_data')
    # ### end Alembic commands ###