"""Tourist_attractions

Revision ID: 4b47f003994f
Revises: 974429b8933e
Create Date: 2024-03-23 20:46:13.906159

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4b47f003994f'
down_revision = '974429b8933e'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tourist_attractions',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('type', sa.String(), nullable=True),
    sa.Column('region', sa.String(), nullable=True),
    sa.Column('locality', sa.String(), nullable=True),
    sa.Column('lat', sa.Float(), nullable=True),
    sa.Column('lon', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_tourist_attractions'))
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('tourist_attractions')
    # ### end Alembic commands ###
