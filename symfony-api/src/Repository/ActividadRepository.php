<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Actividad;

/**
 * @extends ServiceEntityRepository<Actividad>
 */
class ActividadRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Actividad::class);
    }

    public function add(Actividad $actividad): void
    {
        $this->getEntityManager()->persist($actividad);

        $this->getEntityManager()->flush();
    }

    public function update(Actividad $actividad): void
    {
        $this->getEntityManager()->persist($actividad);

        $this->getEntityManager()->flush();
    }

    public function remove(Actividad $actividad): void
    {
        $this->getEntityManager()->remove($actividad);

        $this->getEntityManager()->flush();
    }

}
