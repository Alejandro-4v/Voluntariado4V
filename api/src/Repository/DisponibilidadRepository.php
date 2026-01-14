<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Disponibilidad;

/**
 * @extends ServiceEntityRepository<Disponibilidad>
 */
class DisponibilidadRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Disponibilidad::class);
    }

    public function add(Disponibilidad $disponibilidad): void
    {
        $this->getEntityManager()->persist($disponibilidad);

        $this->getEntityManager()->flush();
    }

    public function update(Disponibilidad $disponibilidad): void
    {
        $this->getEntityManager()->persist($disponibilidad);

        $this->getEntityManager()->flush();
    }

    public function remove(Disponibilidad $disponibilidad): void
    {
        $this->getEntityManager()->remove($disponibilidad);

        $this->getEntityManager()->flush();
    }

}
