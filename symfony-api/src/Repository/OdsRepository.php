<?php

namespace App\Repository;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\Ods;

/**
 * @extends ServiceEntityRepository<Ods>
 */
class OdsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Ods::class);
    }

    public function add(Ods $entity): void
    {
        $this->getEntityManager()->persist($entity);

        $this->getEntityManager()->flush();
    }

    public function update(Ods $entity): void
    {
        $this->getEntityManager()->persist($entity);

        $this->getEntityManager()->flush();
    }

    public function remove(Ods $entity): void
    {
        $this->getEntityManager()->remove($entity);

        $this->getEntityManager()->flush();
    }
}
