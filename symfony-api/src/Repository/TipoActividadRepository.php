<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\TipoActividad;

/**
 * @extends ServiceEntityRepository<TipoActividad>
 */
class TipoActividadRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TipoActividad::class);
    }

    public function findInUse(): array
    {
        $qb = $this->createQueryBuilder('t');

        $qb->where(
            $qb->expr()->in(
                't.idTipoActividad',
                'SELECT at.id_tipo_actividad FROM ACTIVIDAD_TIPO at'
            )
        );

        return $qb->getQuery()->getResult();
    }


    public function add(TipoActividad $tipoActividad): void
    {
        $this->getEntityManager()->persist($tipoActividad);

        $this->getEntityManager()->flush();
    }

    public function update(TipoActividad $tipoActividad): void
    {
        $this->getEntityManager()->persist($tipoActividad);

        $this->getEntityManager()->flush();
    }


    public function remove(TipoActividad $tipoActividad): void
    {
        $this->getEntityManager()->remove($tipoActividad);

        $this->getEntityManager()->flush();
    }
}
