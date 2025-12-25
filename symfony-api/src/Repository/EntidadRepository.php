<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Entidad;

/**
 * @extends ServiceEntityRepository<Entidad>
 */
class EntidadRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Entidad::class);
    }

    public function add(Entidad $entidad): void
    {
        $this->getEntityManager()->persist($entidad);

        $this->getEntityManager()->flush();
    }

    public function update(Entidad $entidad): void
    {
        $this->getEntityManager()->persist($entidad);

        $this->getEntityManager()->flush();
    }

    public function remove(Entidad $entidad): void
    {
        $this->getEntityManager()->remove($entidad);

        $this->getEntityManager()->flush();
    }
}
