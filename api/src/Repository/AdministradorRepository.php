<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Administrador;

/**
 * @extends ServiceEntityRepository<Administrador>
 */
class AdministradorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Administrador::class);
    }

    public function add(Administrador $administrador): void
    {
        $this->getEntityManager()->persist($administrador);

        $this->getEntityManager()->flush();
    }

    public function update(Administrador $administrador): void
    {
        $this->getEntityManager()->persist($administrador);

        $this->getEntityManager()->flush();
    }

    public function remove(Administrador $administrador): void
    {
        $this->getEntityManager()->remove($administrador);

        $this->getEntityManager()->flush();
    }
}
